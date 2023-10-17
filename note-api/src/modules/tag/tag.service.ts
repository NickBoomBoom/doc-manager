import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './entities/tag.entity';
import { TagDTO } from './dto/tag.dto';
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  // 新增
  async create(userId: number, dto: TagDTO): Promise<Tag> {
    const res = await this.tagRepository.save({
      ...dto,
      userId,
    });
    return res;
  }

  async findOne(userId: number, tagId: number): Promise<Tag> {
    return await this.tagRepository.findOne({
      where: {
        id: tagId,
        userId,
      },
    });
  }

  async findAllByUserId(userId: number) {
    return await this.tagRepository.find({
      where: {
        userId,
      },
    });
  }
  // 更新
  async update(userId: number, tagId: number, dto: TagDTO): Promise<Tag> {
    await this.tagRepository.update(userId, dto);
    return this.findOne(userId, tagId);
  }

  async delete(userId: number, tagId: number) {
    const res = await this.findOne(userId, tagId);
    if (res) {
      return await this.tagRepository.delete(tagId);
    } else {
      throw new Error('标签不存在或非本人标签');
    }
  }
}
