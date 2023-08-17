import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
export class TranslateCategoryNoteDTO extends BaseDTO {
  @ApiProperty({
    description: '分类id',
  })
  categoryId: number;

  @ApiProperty({
    description: '笔记id',
  })
  noteId: number;

  @ApiProperty({
    description: '目标分类id',
  })
  targetCategoryId: number;

  @ApiProperty({
    description: '上一级排序id',
  })
  preCategoryNoteId: number;

  @ApiProperty({
    description: '当前排序id',
  })
  categoryNoteId: number;
}
