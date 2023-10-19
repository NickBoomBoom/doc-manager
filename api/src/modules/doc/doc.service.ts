import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doc } from './entities/doc.entity';
import { Repository } from 'typeorm';
import { CreateDocDTO } from './dto/create-doc.dto';
import { v4 as uuidV4 } from 'uuid';
import { UpdateDocDTO } from './dto/update-doc.dto';
import { MenuService } from '../menu/menu.service';
import { MenuItem } from '../menu/menu.interface';
import { DocTagService } from '../doc-tag/doc-tag.service';
@Injectable()
export class DocService {
  constructor(
    @InjectRepository(Doc)
    public readonly docsRepository: Repository<Doc>,
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,
    private readonly docTagRepository: DocTagService,
  ) {}

  async create(
    userId: number,
    createDocDto: CreateDocDTO,
  ): Promise<MenuItem> {
    const shareCode = uuidV4();
    const obj: any = {
      ...createDocDto,
      shareCode,
      userId,
    };
    const doc = await this.docsRepository.create(obj);
    const res: any = await this.docsRepository.save(doc);
    const menu = await this.menuService.createByDoc(
      userId,
      res.id,
      createDocDto.spaceId,
    );
    const docTag = await this.docTagRepository.create({
      docId: res.id,
      tagIds: '',
      updateAt: new Date(),
      userId,
    });

    await this.update(userId, res.id, {
      ...res,
      docTagId: docTag.id,
    });
    return {
      isSpace: false,
      isDoc: true,
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

  async findOne(userId: number, docId: number): Promise<Doc> {
    return await this.docsRepository.findOne({
      where: {
        id: +docId,
        userId,
      },
      // relations: ['docTag'],
    });
  }

  async update(
    userId: number,
    docId: number,
    updateDocDto: UpdateDocDTO,
  ): Promise<boolean> {
    const doc = await this.docsRepository
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.user', 'user')
      .leftJoinAndSelect('doc.space', 'space')
      .where('doc.id=:docId', {
        docId,
      })
      .andWhere('user.id=:userId', { userId })
      .getOne();
    if (!doc) {
      throw new Error('笔记不存在或非本人笔记');
    }

    await this.docsRepository.update(docId, updateDocDto);
    return true;
  }

  async delete(userId: number, docId: number) {
    await this.menuService.deleteByDoc(userId, docId);
    await this.docsRepository.delete(docId);
    return true;
  }
}
