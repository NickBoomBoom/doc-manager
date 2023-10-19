import {
  Body,
  Controller,
  Post,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpaceService } from './space.service';
import { CreateSpaceDTO } from './dto/create-space.dto';
import { UpdateSpaceDTO } from './dto/update-space.dto';
@Controller('space')
@ApiTags('空间')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @ApiOperation({
    summary: '添加空间',
  })
  async create(@Body() createSpaceDto: CreateSpaceDTO, @Request() request) {
    const {
      user: { id, rootSpaceId },
    } = request;
    createSpaceDto.parentId = createSpaceDto.parentId || rootSpaceId;
    return await this.spaceService.create(id, createSpaceDto);
  }

  @Patch(':spaceId')
  @ApiOperation({
    summary: '修改空间',
  })
  async update(
    @Param('spaceId') spaceId: string,
    @Body() updateSpaceDto: UpdateSpaceDTO,
    @Request() request,
  ) {
    const {
      user: { id, rootSpaceId },
    } = request;
    return this.spaceService.update(+spaceId, id, {
      parentId: rootSpaceId,
      ...updateSpaceDto,
    });
  }

  @Delete(':spaceId')
  @ApiOperation({
    summary: '删除空间',
  })
  async delete(@Param('spaceId') spaceId: string, @Request() request) {
    const {
      user: { id },
    } = request;
    return this.spaceService.delete(id, +spaceId);
  }
}
