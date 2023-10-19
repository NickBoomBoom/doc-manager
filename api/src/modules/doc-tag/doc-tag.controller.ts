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
import { DocTagService } from './doc-tag.service';
import { DocTagDTO } from './dto/doc-tag.dto';

@Controller('docTag')
@ApiTags('笔记标签中间表')
export class DocTagController {
  constructor(private readonly docTagService: DocTagService) {}

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  async get(@Request() request) {
    const {
      user: { id },
    } = request;
    return this.docTagService.getAll(id);
  }

  @Get(':docTagId')
  @ApiOperation({ summary: '获取当前文章对应的所有标签' })
  async getByDocTagId(
    @Param('docTagId') docTagId: number,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.docTagService.get(id, docTagId);
  }

  @Patch(':docTagId')
  @ApiOperation({ summary: '更改标签' })
  async update(
    @Param('docTagId') docTagId: number,
    @Body() dto: DocTagDTO,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.docTagService.update(id, docTagId, dto);
  }
}
