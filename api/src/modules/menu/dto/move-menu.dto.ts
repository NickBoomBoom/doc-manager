import { ApiProperty } from '@nestjs/swagger';
export class MoveMenuDTO {
  @ApiProperty({
    description: '移动对象的menu id',
  })
  menuId: number;

  @ApiProperty({
    description: '移动位置的前一个兄弟节点的 id(可能不存在)',
  })
  prevMenuId?: number;

  @ApiProperty({
    description: '移入空间id',
  })
  belongId?: number;
}
