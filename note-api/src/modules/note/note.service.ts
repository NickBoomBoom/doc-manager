import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDTO } from './dto/create-note.dto';
import { v4 as uuidV4 } from 'uuid';
import { UpdateNoteDTO } from './dto/update-note.dto';
import { TagsResponseDTO } from './dto/tag-response.dto';
import { CategoryNoteService } from '../category-note/category-note.service';
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    public readonly notesRepository: Repository<Note>,
    @Inject(forwardRef(() => CategoryNoteService))
    private readonly categoryNoteService: CategoryNoteService,
  ) {}

  async create(userId: number, createNoteDto: CreateNoteDTO): Promise<Note> {
    const shareCode = uuidV4();
    const obj: any = {
      ...createNoteDto,
      shareCode,
      userId,
    };
    const note = await this.notesRepository.create(obj);
    const res: any = await this.notesRepository.save(note);
    console.log(44444, note, res);
    await this.categoryNoteService.create({
      userId,
      noteId: res.id,
      belongCategoryId: createNoteDto.categoryId,
    });

    return res;
  }

  async findOne(userId: number, noteId: number): Promise<Note> {
    return await this.notesRepository.findOne({
      where: {
        id: +noteId,
        userId,
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

    await this.notesRepository.update(noteId, updateNoteDto);
    return true;
  }

  async findTags(userId: number): Promise<TagsResponseDTO> {
    const notes = await this.notesRepository.find({
      where: {
        userId,
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

  async delete(userId: number, noteId: number) {
    const target = await this.findOne(userId, noteId);
    const bol = await this.categoryNoteService.delete({
      userId,
      belongCategoryId: target.categoryId,
      noteId,
    });
    if (bol) {
      await this.notesRepository.delete(noteId);
    }
    return true;
  }
}
