import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { SpaceService } from '../space/space.service';
import { DocService } from '../doc/doc.service';
import { MoveMenuDTO } from './dto/move-menu.dto';
import { KEY, MenuItem, MenuList } from './menu.interface';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @Inject(forwardRef(() => SpaceService))
    private readonly spaceService: SpaceService,
    @Inject(forwardRef(() => DocService))
    private readonly docService: DocService,
  ) {}

  getDocId(id: number) {
    return `${KEY.NOTE}-${id}`;
  }

  getSpaceId(id: number) {
    return `${KEY.CATEGORY}-${id}`;
  }

  getType(str: string): {
    isSpace: boolean;
    isDoc: boolean;
    id: number;
  } {
    const [type, id] = str.split('-');
    return {
      isSpace: type === KEY.CATEGORY,
      isDoc: type === KEY.NOTE,
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

  async createByDoc(userId: number, docId: number, belongId: number) {
    const curId = this.getDocId(docId);
    return this.create(userId, curId, belongId);
  }

  async createBySpace(userId: number, spaceId: number, belongId: number) {
    const curId = this.getSpaceId(spaceId);
    return this.create(userId, curId, belongId);
  }

  async move(userId: number, { menuId, prevMenuId, belongId }: MoveMenuDTO) {
    const item: Menu = await this.menuRepository.findOneBy({
      id: menuId,
    });

    // 解绑之前的关系
    const oldPrevItem: Menu | null = item.prevId
      ? await this.menuRepository.findOneBy({
          userId,
          belongId: item.belongId,
          curId: item.prevId,
        })
      : null;
    const oldNextItem: Menu | null = item.nextId
      ? await this.menuRepository.findOneBy({
          userId,
          belongId: item.belongId,
          curId: item.nextId,
        })
      : null;

    if (oldPrevItem) {
      oldPrevItem.nextId = item.nextId;
      await this.menuRepository.update(oldPrevItem.id, oldPrevItem);
    }

    if (oldNextItem) {
      oldNextItem.prevId = item.prevId;
      await this.menuRepository.update(oldNextItem.id, oldNextItem);
    }
    item.belongId = belongId;

    if (prevMenuId) {
      const prevItem: Menu = await this.menuRepository.findOneBy({
        id: prevMenuId,
      });

      item.prevId = prevItem.curId;
      item.nextId = prevItem.nextId;
      prevItem.nextId = item.curId;
      await this.menuRepository.update(prevItem.id, prevItem);

      if (item.nextId) {
        const nextItem: Menu = await this.menuRepository.findOneBy({
          userId,
          belongId: prevItem.belongId,
          curId: item.nextId,
        });

        nextItem.prevId = item.curId;
        await this.menuRepository.update(nextItem.id, nextItem);
      }
    } else {
      // 如果prevId 不存在,那么item就是当前第一个, 找到当前第一个item
      const firstItem: Menu | null = await this.menuRepository.findOneBy({
        userId,
        belongId,
        prevId: IsNull(),
      });

      if (firstItem?.curId === item.curId) {
        throw new Error('当前移动目标已在其中');
      }

      // 上下交换
      if (firstItem?.nextId === item.curId) {
        const secondItem = await this.menuRepository.findOneBy({
          userId,
          belongId,
          curId: item.nextId,
        });
        firstItem.nextId = item.nextId;
        secondItem.prevId = firstItem.curId;
        await this.menuRepository.update(secondItem.id, secondItem);
      } else {
        item.nextId = firstItem?.curId || null;
        item.prevId = null;
        if (firstItem) {
          firstItem.prevId = item.curId;
        }
      }

      if (firstItem) {
        await this.menuRepository.update(firstItem.id, firstItem);
      }
    }

    await this.menuRepository.update(item.id, item);

    return true;
  }

  private async _getItem(userId: number, item): Promise<MenuItem> {
    const { curId, nextId, id: menuId } = item;
    const { isSpace, isDoc, id: targetId } = this.getType(curId);
    const res: MenuItem = {
      isSpace,
      isDoc,
      menuId,
      targetId,
      data: null,
    };

    if (isSpace) {
      res.children = [];
      const data = await this.spaceService.findOne(userId, targetId);
      res.data = {
        name: data.name,
        parentId: data.parentId,
      };
    }

    if (isDoc) {
      const data = await this.docService.findOne(userId, targetId);
      res.data = {
        title: data.title,
        isLocked: data.isLocked,
        spaceId: data.spaceId,
        shareCode: data.shareCode,
      };
    }

    return res;
  }

  private async _getRows(userId: number, belongId: number): Promise<MenuList> {
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
        if (item.isSpace) {
          item.children = await this._getRows(userId, item.targetId);
        }
        if (isLast) {
          const newTarget = [];
          target
            .filter((t) => t.isSpace)
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

  // TODO: 这边要修改  改成去拉所有doc  space menus 然后内部去做整合
  async getAll(userId: number, belongId: number): Promise<MenuList> {
    const res: MenuList = [];
    // 配置初始层
    const rows = await this._getRows(userId, belongId);
    res.push(...rows);

    let target = rows;
    for (let n = 0; n < target.length; n++) {
      const item = target[n];
      const isLast = n === target.length - 1;
      if (item.isSpace) {
        item.children = await this._getRows(userId, item.targetId);
      }
      if (isLast) {
        const newTarget = [];
        target
          .filter((t) => t.isSpace)
          .forEach((t) => {
            if (t.children?.length) {
              newTarget.push(...t.children);
            }
          });
        target = newTarget;
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
    const { isSpace, isDoc, id } = this.getType(item.curId);

    // 如果是空间,需要预检查该空间下是否存在其他空间或笔记
    if (isSpace) {
      const childCount = await this.menuRepository.countBy({
        belongId: id,
      });
      if (childCount > 0) {
        throw new Error(
          '该空间下存在笔记或其他空间,请先清空内部数据再删除该空间',
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

  async deleteBySpace(userId: number, spaceId: number) {
    const curId = this.getSpaceId(spaceId);
    return await this.delete(userId, curId);
  }
  async deleteByDoc(userId: number, docId: number) {
    const curId = this.getDocId(docId);
    return await this.delete(userId, curId);
  }
}
