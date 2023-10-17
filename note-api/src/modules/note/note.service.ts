import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDTO } from './dto/create-note.dto';
import { v4 as uuidV4 } from 'uuid';
import { UpdateNoteDTO } from './dto/update-note.dto';
import { MenuService } from '../menu/menu.service';
import { MenuItem } from '../menu/menu.interface';
import { NoteTagService } from '../note-tag/note-tag.service';
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    public readonly notesRepository: Repository<Note>,
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,
    private readonly noteTagRepository: NoteTagService,
  ) {}

  async create(
    userId: number,
    createNoteDto: CreateNoteDTO,
  ): Promise<MenuItem> {
    const shareCode = uuidV4();
    const obj: any = {
      ...createNoteDto,
      shareCode,
      userId,
    };
    const note = await this.notesRepository.create(obj);
    const res: any = await this.notesRepository.save(note);
    const menu = await this.menuService.createByNote(
      userId,
      res.id,
      createNoteDto.spaceId,
    );
    const noteTag = await this.noteTagRepository.create({
      noteId: res.id,
      tagIds: '',
      updateAt: new Date(),
    });
    await this.update(userId, res.id, {
      ...res,
      noteTagId: noteTag.id,
    });
    return {
      isSpace: false,
      isNote: true,
      menuId: menu.id,
      targetId: res.id,
      data: {
        title: res.title,
        isLocked: res.isLocked,
        spaceId: res.spaceId,
        shareCode: res.shareCode,
      },
    } as MenuItem;
  }

  async findOne(userId: number, noteId: number): Promise<Note> {
    return await this.notesRepository.findOne({
      where: {
        id: +noteId,
        userId,
      },
      // relations: ['noteTag'],
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
      .leftJoinAndSelect('note.space', 'space')
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

  async delete(userId: number, noteId: number) {
    await this.menuService.deleteByNote(userId, noteId);
    await this.notesRepository.delete(noteId);
    return true;
  }
}
