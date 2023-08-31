import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { MenuService } from '../menu/menu.service';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    public readonly categoryRepository: Repository<Category>,
    private readonly menuService: MenuService,
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
    const category = await this.categoryRepository.create(obj);
    const res = await this.categoryRepository.save(category);
    if (parentId) {
      await this.menuService.createByCategory(userId, res.id, parentId);
    }
    return res;
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

  async delete(userId: number, categoryId: number): Promise<boolean> {
    await this.menuService.deleteByCategory(userId, categoryId);
    await this.categoryRepository.delete(categoryId);
    return true;
  }
}
