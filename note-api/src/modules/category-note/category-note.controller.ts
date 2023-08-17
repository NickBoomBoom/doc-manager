import {
  Body,
  Controller,
  Post,
  Request,
  Patch,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryNoteService } from './category-note.service';
import { TranslateCategoryNoteDTO } from './dto/translate-category-note.dto';
@Controller('categoryNote')
@ApiTags('分类')
export class CategoryNoteController {
  constructor(private readonly categoryNoteService: CategoryNoteService) {}

  @Post('translate')
  @ApiOperation({
    summary: '分类,笔记移动',
  })
  async translate(@Body() dto: TranslateCategoryNoteDTO, @Request() request) {
    const {
      user: { id, rootCategoryId },
    } = request;

    return this.categoryNoteService.translate(id, rootCategoryId, dto);
  }

  @Get('menu')
  @ApiOperation({
    summary: '菜单',
  })
  async get(
    @Request() request,
    @Param('categoryId') categoryId: number,
    @Param('level') level = 4,
  ) {
    const {
      user: { id, rootCategoryId },
    } = request;
    return this.categoryNoteService.get(
      id,
      categoryId || rootCategoryId,
      level,
    );
  }
}
