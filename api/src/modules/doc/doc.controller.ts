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
import { DocService } from './doc.service';
import { CreateDocDTO } from './dto/create-doc.dto';
import { UpdateDocDTO } from './dto/update-doc.dto';

@Controller('doc')
@ApiTags('笔记管理')
export class DocController {
  constructor(private readonly docsService: DocService) {}

  @Get(':docId')
  @ApiOperation({
    summary: '获取指定笔记',
  })
  async get(@Request() request, @Param('docId') docId: number) {
    const {
      user: { id },
    } = request;
    return this.docsService.findOne(id, docId);
  }

  @Post()
  @ApiOperation({
    summary: '添加笔记',
  })
  async create(@Body() createDocDto: CreateDocDTO, @Request() request) {
    const {
      user: { id, rootSpaceId },
    } = request;

    return this.docsService.create(id, {
      ...createDocDto,
      spaceId: createDocDto.spaceId || rootSpaceId,
    });
  }

  @Patch(':docId')
  @ApiOperation({
    summary: '修改笔记',
  })
  async update(
    @Param('docId') docId: string,
    @Body() updateDocDto: UpdateDocDTO,
    @Request() request,
  ) {
    const {
      user: { id },
    } = request;
    return this.docsService.update(id, +docId, updateDocDto);
  }

  @Delete(':docId')
  @ApiOperation({
    summary: '删除笔记',
  })
  async delete(@Param('docId') docId: string, @Request() request) {
    const {
      user: { id },
    } = request;
    return this.docsService.delete(id, +docId);
  }

  @Get('tags')
  @ApiOperation({
    summary: '所有笔记的tags',
  })
  async allTags(@Request() request) {
    const {
      user: { id },
    } = request;
    // return this.docsService.findTags(id);
  }
}
