import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/common/dto/base.dto';
export class UpdateMenuDTO extends BaseDTO {
  @ApiProperty({
    description: '是否为分类',
  })
  isCategory: boolean;

  @ApiProperty({
    description: '分类父级id',
  })
  parentId: number | null;

  @ApiProperty({
    description: '分类id',
  })
  categoryId: number;

  @ApiProperty({
    description: '笔记Id',
  })
  noteId: number;

  @ApiProperty({
    description: '笔记分类id',
  })
  noteCategoryId: number | null;

  @ApiProperty({
    description: '目标位置(0-1-1)',
  })
  targetIndex: string;

  @ApiProperty({
    description: '当前位置(0-1-1)',
  })
  currentIndex: string;
}
