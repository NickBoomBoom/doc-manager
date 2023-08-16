import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/common/dto/base.dto';
export class CreateCategoryDTO extends BaseDTO {
  @ApiProperty({
    description: '名称',
  })
  name: string;

  @ApiProperty({
    description: '父级分类',
  })
  parentId: number | null;

  @ApiProperty({
    description: '层级',
  })
  level?: number;
}
