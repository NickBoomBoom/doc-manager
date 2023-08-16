import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDTO } from './dto/create-note.dto';
import { v4 as uuidV4 } from 'uuid';
import { UpdateNoteDTO } from './dto/update-note.dto';
import { TagsResponseDTO } from './dto/tag-response.dto';
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  async create(userId: number, createNoteDto: CreateNoteDTO): Promise<Note> {
    const shareCode = uuidV4();
    const obj: any = {
      ...createNoteDto,
      shareCode,
      userId,
    };
    const note = await this.notesRepository.create(obj);
    await this.notesRepository.save(note);
    return note[0];
  }

  async findOne(userId: number, noteId: string | number): Promise<Note> {
    return await this.notesRepository.findOne({
      where: {
        id: +noteId,
        // user: {
        //   id: userId,
        // },
      },
      relations: ['user', 'category'],
    });
  }

  async update(
    userId: number,
    noteId: number,
    updateNoteDto: UpdateNoteDTO,
  ): Promise<boolean> {
    const note = await this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .leftJoinAndSelect('note.category', 'category')
      .where('note.id=:noteId', {
        noteId,
      })
      .andWhere('user.id=:userId', { userId })
      .getOne();
    if (!note) {
      throw new Error('笔记不存在或非本人笔记');
    }
    const { categoryId, ...other } = updateNoteDto;
    // if (note.category?.id !== categoryId) {
    //   await this._findBindCategory(categoryId, other, userId);
    // }
    await this.notesRepository.update(noteId, other);
    return true;
  }

  async findTags(userId: number): Promise<TagsResponseDTO> {
    const notes = await this.notesRepository.find({
      where: {
        // user: {
        //   id: userId,
        // },
      },
    });

    const res: TagsResponseDTO = {};
    notes.forEach((t) => {
      const { tags } = t;
      const arr = tags.split(',');
      arr.forEach((tt) => {
        if (res[tt]) {
          res[tt].push(t);
        } else {
          res[tt] = [t];
        }
      });
    });
    return res;
  }

  async bindCategory(userId: number, categoryId: number, noteId: number) {
    const note = await this._findCheckNote(userId, noteId);
    await this._findBindCategory(categoryId, note, userId);
    await this.notesRepository.save(note);
    return true;
  }

  async getAll(userId: number) {
    return await this.notesRepository.find({
      where: {
        // user: {
        //   id: userId,
        // },
      },
    });
  }

  async getNoCategoryNotes(userId: number) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('note.categoryId IS NULL')
      .getMany();
  }

  async _findBindCategory(
    categoryId: number | null,
    target: any,
    userId: number,
  ) {
    // if (categoryId) {
    //   const category = await this.categoryService.findOne(userId, categoryId);
    //   if (!category) {
    //     throw new Error(`category id: ${categoryId} does not exist`);
    //   } else {
    //     target.category = category;
    //   }
    // }
    return target;
  }

  async _findCheckNote(userId: number, noteId: number): Promise<Note> {
    const note = await this.findOne(userId, noteId);
    if (!note) {
      throw new Error(`note id: ${noteId} does not exist`);
    }
    return note;
  }

  async findCountByCategoryId(userId: number, categoryId): Promise<number> {
    const [arr, count] = await this.notesRepository.findAndCountBy({
      userId,
      categoryId,
    });
    return count;
  }
}
