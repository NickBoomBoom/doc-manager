import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CategoryMenuItem } from './category.interface';
import * as moment from 'moment';
import { NoteService } from '../note/note.service';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly usersService: UserService,
    @Inject(forwardRef(() => NoteService))
    private readonly noteService: NoteService,
  ) {}

  async create(
    userId: number,
    createCategoryDto: CreateCategoryDTO,
  ): Promise<Category> {
    const obj = {
      ...createCategoryDto,
      user: await this.usersService.findOne(userId),
    };
    const { parentId } = createCategoryDto;
    if (parentId) {
      const parentCategory = await this.findOne(userId, parentId);
      obj.level = parentCategory.level + 1;
    }
    const res = await this.categoryRepository.save(obj);
    return res;
  }

  async findOne(userId: number, categoryId: number): Promise<Category> {
    const res = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        user: {
          id: userId,
        },
      },
    });
    if (res) {
      return res;
    } else {
      throw new Error('分类不存在或非当前分类');
    }
  }

  async update(
    categoryId: number,
    userId: number,
    updateCategoryDto: UpdateCategoryDTO,
  ) {
    const target = await this.findOne(userId, categoryId);
    const { parentId } = updateCategoryDto;
    if (target.parentId !== parentId) {
      const parentCategory = await this.findOne(userId, parentId);
      target.level = parentCategory.level + 1;
    }
    await this.categoryRepository.update(categoryId, {
      ...target,
      ...updateCategoryDto,
    });
    return true;
  }

  async save(category: Category) {
    return await this.categoryRepository.save(category);
  }

  async getAll(userId: number) {
    return await this.categoryRepository.findBy({
      user: {
        id: userId,
      },
    });
  }

  async getNestedCategories(
    userId: number,
    level = 0,
    parentId?: number | null,
    checkNoCategory = true,
  ): Promise<CategoryMenuItem[]> {
    const parent: any = await this.categoryRepository.find({
      where: {
        user: {
          id: userId,
        },
        level,
        parentId,
      },
      relations: ['notes'],
    });

    for (const child of parent) {
      const childCategory = (
        await this.getNestedCategories(userId, level + 1, child.id, false)
      ).map((t) => {
        return {
          ...t,
          isCategory: true,
        };
      });
      const notes = child.notes.map((t) => {
        const { id, title, tags, isLocked, shareCode } = t;
        return {
          isNote: true,
          id,
          title,
          tags,
          isLocked,
          shareCode,
        };
      });
      child.isCategory = true;
      child.children = [...childCategory, ...notes].sort(
        (a, b) => moment(a.createAt).valueOf() - moment(b.createAt).valueOf(),
      );
      Reflect.deleteProperty(child, 'notes');
    }

    if (checkNoCategory) {
      const noCategoryNotes = (
        await this.noteService.getNoCategoryNotes(userId)
      ).map((t) => {
        const { id, title, tags, isLocked, shareCode } = t;
        return {
          isNote: true,
          id,
          title,
          tags,
          isLocked,
          shareCode,
        };
      });
      return [...parent, ...noCategoryNotes].sort(
        (a, b) => moment(a.createAt).valueOf() - moment(b.createAt).valueOf(),
      );
    }
    return parent.sort(
      (a, b) => moment(a.createAt).valueOf() - moment(b.createAt).valueOf(),
    );
  }

  async delete(categoryId: number, userId: number): Promise<boolean> {
    const res = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        user: {
          id: userId,
        },
      },
      relations: ['notes'],
    });
    if (res.notes.length > 0) {
      throw new Error('你好,该分类下存在笔记,请先删除笔记再删除');
    }
    await this.categoryRepository.delete(categoryId);
    return true;
  }
}
