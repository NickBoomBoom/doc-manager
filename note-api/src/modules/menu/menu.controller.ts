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
  async move(@Request() request, @Body() dto: MoveMenuDTO) {
    const {
      user: { id, rootCategoryId },
    } = request;

    if (!dto.belongId) {
      dto.belongId = rootCategoryId;
    }
    console.log(3333, dto);

    return this.menuService.move(id, dto);
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

  @Get('/all')
  @ApiOperation({
    summary: '全部菜单',
  })
  async getAll(@Request() request, @Query('categoryId') categoryId: number) {
    const {
      user: { id, rootCategoryId },
    } = request;
    return this.menuService.getAll(id, categoryId || rootCategoryId);
  }
}
