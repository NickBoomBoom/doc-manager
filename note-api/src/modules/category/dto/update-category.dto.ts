import { ApiProperty } from '@nestjs/swagger';
export class UpdateCategoryDTO {
  @ApiProperty({
    description: '名称',
  })
  name?: string;

  @ApiProperty({
    description: '父级分类',
  })
  parentId: number | null;
}
