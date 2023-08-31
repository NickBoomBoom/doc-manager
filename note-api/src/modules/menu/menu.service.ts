import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CategoryService } from '../category/category.service';
import { NoteService } from '../note/note.service';
import { MoveMenuDTO } from './dto/move-menu.dto';
import { KEY, MenuItem, MenuList } from './menu.interface';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => NoteService))
    private readonly noteService: NoteService,
  ) {}

  getNoteId(id: number) {
    return `${KEY.NOTE}-${id}`;
  }

  getCategoryId(id: number) {
    return `${KEY.CATEGORY}-${id}`;
  }

  getType(str: string): {
    isCategory: boolean;
    isNote: boolean;
    id: number;
  } {
    const [type, id] = str.split('-');
    return {
      isCategory: type === KEY.CATEGORY,
      isNote: type === KEY.NOTE,
      id: +id,
    };
  }

  private async create(
    userId: number,
    curId: string,
    belongId: number,
  ): Promise<any> {
    const arr = await this.menuRepository.find({
      where: {
        userId,
        belongId,
      },
    });
    const lastItem = arr.length > 0 ? arr[arr.length - 1] : null;
    const obj = {
      userId,
      curId,
      belongId,
      prevId: lastItem?.curId,
    };
    const res = await this.menuRepository.save(obj);
    if (lastItem) {
      await this.menuRepository.update(lastItem.id, {
        nextId: curId,
      });
    }
    return res;
  }

  async createByNote(userId: number, noteId: number, belongId: number) {
    const curId = this.getNoteId(noteId);
    return this.create(userId, curId, belongId);
  }

  async createByCategory(userId: number, categoryId: number, belongId: number) {
    const curId = this.getCategoryId(categoryId);
    return this.create(userId, curId, belongId);
  }

  async move(userId: number, rootCategoryId: number, dto: MoveMenuDTO) {
    return true;
  }

  async _getItem(userId: number, item): Promise<MenuItem> {
    const { curId, nextId } = item;
    const { isCategory, isNote, id } = this.getType(curId);
    const res: MenuItem = {
      isCategory,
      isNote,
      id,
      data: null,
    };

    if (isCategory) {
      res.children = [];
      const data = await this.categoryService.findOne(userId, id);
      res.data = {
        name: data.name,
        parentId: data.parentId,
      };
    }

    if (isNote) {
      const data = await this.noteService.findOne(userId, id);
      res.data = {
        title: data.title,
        tags: data.tags,
        categoryId: data.categoryId,
        shareCode: data.shareCode,
      };
    }

    return res;
  }

  async _getRows(userId: number, belongId: number): Promise<MenuList> {
    const res: MenuList = [];
    const menus = await this.menuRepository.findBy({
      userId,
      belongId,
    });
    let target = menus.find((t) => t.prevId === null);
    while (target) {
      const obj = await this._getItem(userId, target);
      res.push(obj);
      if (target.nextId) {
        target = menus.find((t) => t.curId === target.nextId);
      } else {
        target = null;
      }
    }

    return res;
  }
  async get(
    userId: number,
    belongId: number,
    level: number,
  ): Promise<MenuList> {
    const res: MenuList = [];
    // 配置初始层
    const rows = await this._getRows(userId, belongId);
    res.push(...rows);

    let target = rows;
    for (let i = 0; i < level - 1; i++) {
      for (let n = 0; n < target.length; n++) {
        const item = target[n];
        const isLast = n === target.length - 1;
        if (item.isCategory) {
          item.children = await this._getRows(userId, item.id);
        }
        if (isLast) {
          const newTarget = [];
          target
            .filter((t) => t.isCategory)
            .forEach((t) => {
              if (t.children?.length) {
                newTarget.push(...t.children);
              }
            });
          target = newTarget;
        }
      }
    }

    return res;
  }

  private async delete(userId: number, curId: string) {
    const item = await this.menuRepository.findOneBy({
      userId,
      curId,
    });

    const { prevId, nextId } = item;
    const { isCategory, isNote, id } = this.getType(item.curId);

    // 如果是分类,需要预检查该分类下是否存在其他分类或笔记
    if (isCategory) {
      const childCount = await this.menuRepository.countBy({
        belongId: id,
      });
      if (childCount > 0) {
        throw new Error(
          '该分类下存在笔记或其他分类,请先清空内部数据再删除该分类',
        );
      }
    }

    // 更新前置数据,当prevId不存在的时候 证明当前数据是首位数据
    if (prevId) {
      const prevItem = await this.menuRepository.findOneBy({
        userId,
        curId: prevId,
      });
      prevItem.nextId = item.nextId;
      await this.menuRepository.update(prevItem.id, prevItem);
    }

    // 更新后置数据,当newtId不存在的时候,证明当前是最尾数据
    if (nextId) {
      const nextItem = await this.menuRepository.findOneBy({
        userId,
        curId: nextId,
      });
      nextItem.prevId = item.prevId;
      await this.menuRepository.update(nextItem.id, nextItem);
    }

    // 删除当前数据信息
    await this.menuRepository.delete(item.id);

    return true;
  }

  async deleteByCategory(userId: number, categoryId: number) {
    const curId = this.getCategoryId(categoryId);
    return this.delete(userId, curId);
  }
  async deleteByNote(userId: number, noteId: number) {
    const curId = this.getNoteId(noteId);
    return this.delete(userId, curId);
  }
}
