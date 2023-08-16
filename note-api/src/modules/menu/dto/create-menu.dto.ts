import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/common/dto/base.dto';
export class CreateMenuDTO extends BaseDTO {
  @ApiProperty({
    description: '索引string',
  })
  raw: object;
}
