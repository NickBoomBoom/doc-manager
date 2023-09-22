import { ApiProperty } from '@nestjs/swagger';
export class MoveMenuDTO {
  @ApiProperty({
    description: '目标menu id',
  })
  menuId: number;

  @ApiProperty({
    description: '上一级menu id',
  })
  prevMenuId: number | null;

  @ApiProperty({
    description: '所属哪个空间下',
  })
  belongId: number;
}
