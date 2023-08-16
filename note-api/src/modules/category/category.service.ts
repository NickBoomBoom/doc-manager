import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDTO } from './dto/update-category.dto';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    userId: number,
    createCategoryDto: CreateCategoryDTO,
  ): Promise<any> {
    const obj = {
      ...createCategoryDto,
      userId,
    };
    const { parentId } = createCategoryDto;
    const [, count] = await this.categoryRepository.findAndCountBy({
      userId,
      parentId,
    });
    const category = await this.categoryRepository.create(obj);
    // const noteCount = await this.noteService.findCountByCategoryId(
    //   userId,
    //   category.id,
    // );
    // obj.order = count + noteCount;
    console.log(3333, obj, category);
    return await this.categoryRepository.save(category);
  }

  async findOne(userId: number, id: number): Promise<Category> {
    const res = await this.categoryRepository.findOne({
      where: {
        id,
        userId,
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
      userId,
    });
  }

  async delete(categoryId: number, userId: number): Promise<boolean> {
    const res = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        userId,
      },
      // relations: ['notes'],
    });
    // if (res.notes.length > 0) {
    //   throw new Error('你好,该分类下存在笔记,请先删除笔记再删除');
    // }
    await this.categoryRepository.delete(categoryId);
    return true;
  }
}
