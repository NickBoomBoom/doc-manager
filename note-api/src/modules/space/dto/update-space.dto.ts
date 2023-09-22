import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';

export class UpdateSpaceDTO extends BaseDTO {
  @ApiProperty({
    description: '名称',
  })
  name?: string;

  @ApiProperty({
    description: '父级空间',
  })
  parentId: number;
}
