import {
  Body,
  Controller,
  Post,
  Request,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoteService } from './note.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';

@Controller('note')
@ApiTags('笔记管理')
export class NoteController {
  constructor(private readonly notesService: NoteService) {}

  @Get()
  @ApiOperation({
    summary: '获取当前用户所有笔记',
  })
  async getAll(@Request() request) {
    const {
      user: { id },
    } = request;
    return this.notesService.getAll(id);
  }

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
      user: { id },
    } = request;
    return this.notesService.create(id, createNoteDto);
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

  // @Post('bind/category/:categoryId/:noteId')
  // @ApiOperation({
  //   summary: '绑定分类',
  // })
  // async bindCategory(
  //   @Request() request,
  //   @Param('categoryId') categoryId,
  //   @Param('noteId') noteId,
  // ) {
  //   const {
  //     user: { id },
  //   } = request;
  //   return this.notesService.bindCategory(id, categoryId, noteId);
  // }
}
