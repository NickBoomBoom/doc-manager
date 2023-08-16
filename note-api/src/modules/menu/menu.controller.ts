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
import { CreateMenuDTO } from './dto/create-menu.dto';
import { UpdateMenuDTO } from './dto/update-menu.dto';

@Controller('menu')
@ApiTags('菜单')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({
    summary: '获取当前菜单',
  })
  async getAll(@Request() request) {
    const {
      user: { id },
    } = request;
    const res = await this.menuService.get(id);
    return res;
  }

  @Patch()
  @ApiOperation({
    summary: '修改菜单',
  })
  async update(@Body() updateMenuDto: UpdateMenuDTO, @Request() request) {
    const {
      user: { id },
    } = request;
    return await this.menuService.update(id, updateMenuDto);
  }
}
