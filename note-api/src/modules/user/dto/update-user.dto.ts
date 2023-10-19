import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
export class UpdateUserDTO extends BaseDTO {
  @ApiProperty({
    description: '用户名',
  })
  name?: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @Length(5, 16)
  password?: string;

  @ApiProperty({
    description: '根空间id',
  })
  rootSpaceId?: number;
}
