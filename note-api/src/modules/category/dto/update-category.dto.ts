import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';

export class UpdateCategoryDTO extends BaseDTO {
  @ApiProperty({
    description: '名称',
  })
  name?: string;

  @ApiProperty({
    description: '父级分类',
  })
  parentId?: number;

  @ApiProperty({
    description: '下标',
  })
  order: number;
}
