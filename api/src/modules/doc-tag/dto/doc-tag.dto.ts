import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
export class DocTagDTO extends BaseDTO {
  @ApiProperty({
    description: '标签ids',
    example: '1,2,3',
  })
  tagIds: string;

  @ApiProperty({
    description: 'docId',
    example: '1',
  })
  docId: number;

  @ApiProperty({
    description: 'userId',
    example: '1',
  })
  userId: number;
}
