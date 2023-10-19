import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocTag } from './entities/doc-tag.entity';
import { DocTagDTO } from './dto/doc-tag.dto';
import { Tag } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';

export interface AllDocTags extends Tag {
  docs: number[];
}
@Injectable()
export class DocTagService {
  constructor(
    @InjectRepository(DocTag)
    private readonly docTagRepository: Repository<DocTag>,
    private readonly tagService: TagService,
  ) {}
  // 新增
  async create(dto: DocTagDTO): Promise<DocTag> {
    const res = await this.docTagRepository.save({
      ...dto,
    });
    return res;
  }

  async findOne(userId: number, id: number): Promise<DocTag> {
    return await this.docTagRepository.findOne({
      where: { id, userId },
    });
  }

  async getAll(userId: number): Promise<AllDocTags[]> {
    const docTag = await this.docTagRepository.find({
      where: {
        userId,
      },
    });
    const tags = await this.tagService.findAllByUserId(userId);
    const res: AllDocTags[] = [];
    tags.forEach((t: Tag) => {
      res.push({
        ...t,
        docs: docTag
          .filter((tt: DocTag) => tt.tagIds.includes(t.id + ''))
          .map((tt: DocTag) => tt.docId),
      });
    });
    return res;
  }

  // 更新
  async update(userId: number, id: number, dto: DocTagDTO): Promise<DocTag> {
    const res = await this.findOne(userId, id);
    const newItem = {
      ...res,
      ...dto,
    };
    await this.docTagRepository.update(id, {
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
