import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
export class TagDTO extends BaseDTO {
  @ApiProperty({
    description: '标签名',
    example: 'vue3',
  })
  name: string;
}
