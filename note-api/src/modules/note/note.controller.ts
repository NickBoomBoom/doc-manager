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
import { NoteService } from './note.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';

@Controller('note')
@ApiTags('笔记管理')
export class NoteController {
  constructor(private readonly notesService: NoteService) {}

  @Get(':noteId')
  @ApiOperation({
    summary: '获取指定笔记',
  })
  async get(@Request() request, @Param('noteId') noteId: number) {
    const {
      user: { id },
    } = request;
    return this.notesService.findOne(id, noteId);
  }

  @Post()
  @ApiOperation({
    summary: '添加笔记',
  })
  async create(@Body() createNoteDto: CreateNoteDTO, @Request() request) {
    const {
      user: { id, rootCategoryId },
    } = request;

    return this.notesService.create(id, {
      ...createNoteDto,
      categoryId: createNoteDto.categoryId || rootCategoryId,
    });
  }

  @Patch(':noteId')
  @ApiOperation({
    summary: '修改笔记',
  })
  async update(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDTO,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.notesService.update(id, +noteId, updateNoteDto);
  }

  @Delete(':noteId')
  @ApiOperation({
    summary: '删除笔记',
  })
  async delete(@Param('noteId') noteId: string, @Request() request) {
    const {
      user: { id },
    } = request;
    return this.notesService.delete(id, +noteId);
  }

  @Get('tags')
  @ApiOperation({
    summary: '所有笔记的tags',
  })
  async allTags(@Request() request) {
    const {
      user: { id },
    } = request;
    return this.notesService.findTags(id);
  }
}
