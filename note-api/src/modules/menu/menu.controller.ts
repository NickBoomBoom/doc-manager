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
import { MenuService } from './menu.service';
import { MoveMenuDTO } from './dto/move-menu.dto';
@Controller('menu')
@ApiTags('分类')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('move')
  @ApiOperation({
    summary: '分类,笔记移动',
  })
  async move(@Body() dto: MoveMenuDTO, @Request() request) {
    const {
      user: { id, rootCategoryId },
    } = request;

    return this.menuService.move(id, rootCategoryId, dto);
  }

  @Get()
  @ApiOperation({
    summary: '菜单',
  })
  async get(
    @Request() request,
    @Query('categoryId') categoryId: number,
    @Query('level') level = 4,
  ) {
    const {
      user: { id, rootCategoryId },
    } = request;
    return this.menuService.get(id, categoryId || rootCategoryId, level);
  }
}
