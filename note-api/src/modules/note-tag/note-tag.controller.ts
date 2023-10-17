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
import { NoteTagService } from './note-tag.service';
import { NoteTagDTO } from './dto/note-tag.dto';

@Controller('noteTag')
@ApiTags('笔记标签中间表')
export class NoteTagController {
  constructor(private readonly noteTagService: NoteTagService) {}

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  async get(@Request() request) {
    const {
      user: { id },
    } = request;
    return this.noteTagService.getAll(id);
  }

  @Get(':noteTagId')
  @ApiOperation({ summary: '获取当前文章对应的所有标签' })
  async getByNoteTagId(
    @Param('noteTagId') noteTagId: number,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.noteTagService.get(id, noteTagId);
  }

  @Patch(':noteTagId')
  @ApiOperation({ summary: '更改标签' })
  async update(
    @Param('noteTagId') noteTagId: number,
    @Body() dto: NoteTagDTO,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.noteTagService.update(id, noteTagId, dto);
  }
}
