import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
export class CreateNoteDTO extends BaseDTO {
  @ApiProperty({
    description: '标题',
  })
  title: string;

  @ApiProperty({
    description: '内容',
  })
  content: object;

  @ApiProperty({
    description: '空间id',
  })
  spaceId: number;
}
