import { ApiProperty } from '@nestjs/swagger';
export class MoveMenuDTO {
  @ApiProperty({
    description: '当前id(category-{number}  note-{number})',
  })
  targetId: string;

  @ApiProperty({
    description: '上一级id(category-{number}  note-{number})',
  })
  preId: string;
}
