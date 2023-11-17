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
@ApiTags('菜单')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('move')
  @ApiOperation({
    summary: '空间,笔记移动',
  })
  async move(@Request() request, @Body() dto: MoveMenuDTO) {
    const {
      user: { id, rootSpaceId },
    } = request;

    if (!dto.belongId) {
      dto.belongId = rootSpaceId;
    }
    return this.menuService.move(id, dto);
  }

  @Get()
  @ApiOperation({
    summary: '菜单',
  })
  async get(
    @Request() request,
    @Query('spaceId') spaceId: number,
    @Query('level') level = 4,
  ) {
    const {
      user: { id, rootSpaceId },
    } = request;
    return this.menuService.get(id, spaceId || rootSpaceId, level);
  }

  @Get('/all')
  @ApiOperation({
    summary: '全部菜单',
  })
  async getAll(@Request() request, @Query('spaceId') spaceId: number) {
    const {
      user: { id, rootSpaceId },
    } = request;
    return this.menuService.getAll(id, spaceId || rootSpaceId);
  }
}
