import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDTO } from './dto/create-menu.dto';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { CategoryMenuItem } from '../category/category.interface';
import { MenuItem } from './menu.interface';
import { UpdateCategoryDTO } from '../category/dto/update-category.dto';
import { UpdateMenuDTO } from './dto/update-menu.dto';
import { NoteService } from '../note/note.service';
import { cloneDeep } from 'lodash';
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private categoryService: CategoryService,
    private userService: UserService,
    @Inject(forwardRef(() => NoteService))
    private readonly noteService: NoteService,
  ) {}
  async findOne(userId: number): Promise<Menu> {
    return await this.menuRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
  async create(userId: number, menuDto: CreateMenuDTO) {
    const obj = {
      ...menuDto,
      user: await this.userService.findOne(userId),
    };
    return await this.menuRepository.save(obj);
  }

  async update(userId: number, updateMenuDto: UpdateMenuDTO): Promise<boolean> {
    const {
      isCategory,
      parentId,
      categoryId,
      noteId,
      noteCategoryId,
      targetIndex,
      currentIndex,
    } = updateMenuDto;
    if (!currentIndex || !targetIndex) {
      throw new Error('currentIndex or targetIndex is null ');
    }
    if (isCategory) {
      if (!categoryId) {
        throw new Error('categoryId is null');
      }
    } else {
      if (!noteId) {
        throw new Error('noteId is null');
      }
    }
    const targetIndexArr = targetIndex.split('-').map((t) => +t);
    const currentIndexArr = currentIndex.split('-').map((t) => +t);
    const data = await this.findOne(userId);
    const item = this._findTarget(data.raw as MenuItem[], currentIndexArr);
    if (!item) {
      throw new Error('索引位置错误,未找到对应目标');
    }
    this._updateRaw(data.raw as MenuItem[], item, targetIndexArr);
    await this.menuRepository.update(data.id, {
      raw: JSON.stringify(data.raw) as unknown as object,
    });
    if (isCategory) {
      await this.categoryService.update(categoryId, userId, {
        parentId,
      });
    } else {
      const note = await this.noteService.findOne(userId, noteId);
      await this.noteService.update(userId, noteId, {
        ...note,
        categoryId: noteCategoryId,
        updateAt: new Date(),
      });
    }

    return true;
  }

  async get(userId: number): Promise<CategoryMenuItem[]> {
    const arr: CategoryMenuItem[] =
      await this.categoryService.getNestedCategories(userId);
    const item = await this.findOne(userId);
    if (!item) {
      const raw = JSON.stringify(this._serialize(arr)) as unknown as object;
      await this.create(userId, {
        raw,
        createAt: new Date(),
        updateAt: new Date(),
      });
      return arr;
    } else {
      return this._parse(arr, item.raw as MenuItem[]);
    }
  }

  _serialize(arr: any[]): MenuItem[] {
    return arr.map((t) => {
      const res: MenuItem = {
        id: t.id,
        isCategory: t.isCategory,
        isNote: t.isNote,
      };
      if (t.isCategory) {
        res.children = this._serialize(t.children || []);
      }
      return res;
    });
  }

  _parse(arr: any[], rank: MenuItem[] = []): CategoryMenuItem[] {
    return rank.map((t) => {
      const { id, children } = t;
      const target = arr.find((tt) => tt.id === id);
      const res = {
        ...target,
      };
      if (target.isCategory) {
        res.children = this._parse(target.children, children);
      }
      return res;
    });
  }

  _findTarget(arr: MenuItem[], position: number[]): MenuItem {
    let res = arr;
    for (let i = 0; i < position.length; i++) {
      const isLast = i === position.length - 1;
      const item = position[i];
      if (isLast) {
        const tmp = cloneDeep(res[item]);
        res.splice(item, 1);
        return tmp;
      } else {
        res = res[item].children;
      }
    }
  }

  _updateRaw(arr: MenuItem[], item: MenuItem, position: number[]) {
    let res = arr;
    for (let i = 0; i < position.length; i++) {
      const t = position[i];
      const isLast = i === position.length - 1;
      if (isLast) {
        res.splice(t, 0, item);
      } else {
        res = res[t].children;
      }
    }
  }
}
