import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteTag } from './entities/note-tag.entity';
import { NoteTagDTO } from './dto/note-tag.dto';
import { Tag } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';

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

  async findOne(id: number): Promise<NoteTag> {
    return await this.noteTagRepository.findOne({
      where: { id },
    });
  }

  // 更新
  async update(id: number, dto: NoteTagDTO): Promise<NoteTag> {
    await this.noteTagRepository.update(id, dto);
    return this.findOne(id);
  }

  async get(userId: number, id: number): Promise<Tag[]> {
    const { tagIds } = await this.findOne(id);
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
