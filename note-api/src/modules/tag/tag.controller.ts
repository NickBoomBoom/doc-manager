import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Patch,
  Query,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TagService } from './tag.service';
import { TagDTO } from './dto/tag.dto';

@Controller('tag')
@ApiTags('标签管理')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: '所有标签' })
  async getAll(@Request() request) {
    const {
      user: { id },
    } = request;
    return this.tagService.findAllByUserId(id);
  }

  @Post()
  @ApiOperation({ summary: '创建标签' })
  async create(@Request() request, @Body() dto: TagDTO) {
    const {
      user: { id },
    } = request;
    return this.tagService.create(id, dto);
  }

  @Patch(':tagId')
  @ApiOperation({ summary: '更改标签' })
  async login(
    @Request() request,
    @Param('tagId') tagId: number,
    @Body() dto: TagDTO,
  ) {
    const {
      user: { id },
    } = request;
    return this.tagService.update(id, tagId, dto);
  }

  @Delete(':tagId')
  @ApiOperation({ summary: '删除标签' })
  async delete(@Request() request, @Param('tagId') tagId: number) {
    const {
      user: { id },
    } = request;
    return this.tagService.delete(id, tagId);
  }
}
