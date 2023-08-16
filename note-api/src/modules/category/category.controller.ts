import {
  Body,
  Controller,
  Post,
  Request,
  Patch,
  Param,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
@Controller('category')
@ApiTags('分类')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: '添加分类',
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDTO,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return await this.categoryService.create(id, createCategoryDto);
  }

  @Patch(':categoryId')
  @ApiOperation({
    summary: '修改分类',
  })
  async update(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.categoryService.update(+categoryId, id, updateCategoryDto);
  }

  @Delete(':categoryId')
  @ApiOperation({
    summary: '删除分类',
  })
  async delete(@Param('categoryId') categoryId: string, @Request() request) {
    const {
      user: { id },
    } = request;
    return this.categoryService.delete(+categoryId, id);
  }

  // @Post('bind')
  // @ApiOperation({
  //   summary: '绑定父级分类',
  // })
  // async bindParentCategory(
  //   @Body('parentId') parentId: number,
  //   @Body('categoryId') categoryId: number,
  //   @Request() request,
  // ) {
  //   const {
  //     user: { id },
  //   } = request;
  //   return this.categoryService.update(+categoryId, id, {
  //     parentId: +parentId,
  //   });
  // }
}
