import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryNote } from './entities/category-note.entity';
import { TranslateCategoryNoteDTO } from './dto/translate-category-note.dto';
import { CategoryService } from '../category/category.service';
import { NoteService } from '../note/note.service';

@Injectable()
export class CategoryNoteService {
  constructor(
    @InjectRepository(CategoryNote)
    private readonly categoryNoteRepository: Repository<CategoryNote>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => NoteService))
    private readonly noteService: NoteService,
  ) {}

  async create({
    userId,
    categoryId,
    belongCategoryId,
    noteId,
  }: {
    userId: number;
    categoryId?: number;
    belongCategoryId?: number;
    noteId?: number;
  }): Promise<any> {
    const isCategory = !noteId;
    // 父级目录
    const [arr, count] = await this.categoryNoteRepository.findAndCountBy({
      belongCategoryId,
      userId,
    });

    const res = await this.categoryNoteRepository.create({
      userId,
      noteId,
      categoryId,
      belongCategoryId,
      order: arr.length > 0 ? arr[arr.length - 1].order + 1 : 0,
      isCategory,
    });

    return await this.categoryNoteRepository.save(res);
  }

  async translate(
    userId: number,
    rootCategoryId: number,
    dto: TranslateCategoryNoteDTO,
  ) {
    const {
      noteId,
      categoryId,
      targetCategoryId,
      preCategoryNoteId,
      categoryNoteId,
    } = dto;
    const isCategory = !!categoryId;

    const target = await this.categoryNoteRepository.findOneBy({
      id: categoryNoteId,
      userId,
    });

    let order = 0;

    if (preCategoryNoteId) {
      const preTarget = await this.categoryNoteRepository.findOneBy({
        id: preCategoryNoteId,
        userId,
      });
      const arr = await this.categoryNoteRepository.findBy({
        userId,
        belongCategoryId: preTarget.belongCategoryId,
      });
      console.log(333, arr);

      order = preTarget.order + 1;

      // 批量递增剩余id
      const changeIds = arr
        .filter((t) => t.order > preTarget.order)
        .map((t) => t.id);
      await this.categoryNoteRepository
        .createQueryBuilder()
        .update(CategoryNote)
        .whereInIds(changeIds)
        .set({
          order: () => '"order" + 1',
        })
        .execute();
    }

    const res = await this.categoryNoteRepository.update(categoryNoteId, {
      ...target,
      belongCategoryId: targetCategoryId,
      order,
    });

    if (isCategory) {
      await this.categoryService.update(categoryId, userId, {
        parentId: targetCategoryId,
        updateAt: new Date(),
      });
    } else {
      await this.noteService.update(userId, noteId, {
        categoryId: targetCategoryId,
        updateAt: new Date(),
      });
    }

    return true;
  }

  async delete({
    userId,
    belongCategoryId,
    noteId,
    categoryId,
  }: {
    userId: number;
    categoryId?: number;
    belongCategoryId?: number;
    noteId?: number;
  }): Promise<boolean> {
    const [, count] = await this.categoryNoteRepository.findAndCountBy({
      belongCategoryId,
      userId,
    });
    const isCategory = !!categoryId;

    if (isCategory && count > 1) {
      throw new Error('请先清空分类中的数据再进行删除');
    } else {
      await this.categoryNoteRepository.delete({
        userId,
        noteId,
        categoryId,
      });
    }
    return true;
  }

  async get(userId: number, categoryId: number, level: number) {
    const res = [];

    let arr = [];
    for (let i = 0; i < level; i++) {
      const isFirst = i === 0;

      if (isFirst) {
        const result = await this._getRes(userId, categoryId);
        res.push(...result);
        arr = res.filter((t) => t.isCategory);
      } else {
        const newArr = [];
        for (let j = 0; j < arr.length; j++) {
          arr[j].children = await this._getRes(userId, arr[j].id);
          newArr.push(...arr[j].children);
        }
        arr = newArr.filter((t) => t.isCategory);
      }
    }
    return res;
  }

  async _getRes(userId: number, categoryId: number) {
    const res = [];

    const categories = await this.categoryService.categoryRepository.findBy({
      userId,
      parentId: categoryId,
    });
    const notes = await this.noteService.notesRepository.findBy({
      userId,
      categoryId,
    });
    const sorts = await this.categoryNoteRepository.find({
      where: {
        belongCategoryId: categoryId,
        userId,
      },
      order: {
        order: 'ASC',
      },
    });

    sorts.forEach((t) => {
      const { isCategory, categoryId, id: categoryNoteId, noteId } = t;
      if (isCategory) {
        const { userId, ...category } = categories.find(
          (tt) => tt.id === categoryId,
        );
        res.push({
          ...category,
          children: [],
          categoryNoteId,
          isCategory: true,
        });
      } else {
        const { content, ...note } = notes.find((tt) => tt.id === noteId);
        res.push({
          ...note,
          categoryNoteId,
          isNote: true,
        });
      }
    });
    return res;
  }
}
