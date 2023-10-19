import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteTag } from './entities/note-tag.entity';
import { NoteTagDTO } from './dto/note-tag.dto';
import { Tag } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';

export interface AllNoteTags extends Tag {
  notes: number[];
}
@Injectable()
export class NoteTagService {
  constructor(
    @InjectRepository(NoteTag)
    private readonly noteTagRepository: Repository<NoteTag>,
    private readonly tagService: TagService,
  ) {}
  // 新增
  async create(dto: NoteTagDTO): Promise<NoteTag> {
    const res = await this.noteTagRepository.save({
      ...dto,
    });
    return res;
  }

  async findOne(userId: number, id: number): Promise<NoteTag> {
    return await this.noteTagRepository.findOne({
      where: { id, userId },
    });
  }

  async getAll(userId: number): Promise<AllNoteTags[]> {
    const noteTag = await this.noteTagRepository.find({
      where: {
        userId,
      },
    });
    const tags = await this.tagService.findAllByUserId(userId);
    const res: AllNoteTags[] = [];
    tags.forEach((t: Tag) => {
      res.push({
        ...t,
        notes: noteTag
          .filter((tt: NoteTag) => tt.tagIds.includes(t.id + ''))
          .map((tt: NoteTag) => tt.noteId),
      });
    });
    return res;
  }

  // 更新
  async update(userId: number, id: number, dto: NoteTagDTO): Promise<NoteTag> {
    const res = await this.findOne(userId, id);
    const newItem = {
      ...res,
      ...dto,
    };
    await this.noteTagRepository.update(id, {
      ...res,
      ...dto,
    });
    return newItem;
  }

  async get(userId: number, id: number): Promise<Tag[]> {
    const { tagIds } = await this.findOne(userId, id);
    if (!tagIds) {
      return [];
    }
    const arr = tagIds.split(',').map((t) => {
      return () => this.tagService.findOne(userId, +t);
    });
    const res = await Promise.all(arr.map((t) => t()));
    return res;
  }
}
