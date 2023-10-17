import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/common/dto/base.dto';
export class UpdateNoteDTO extends BaseDTO {
  @ApiProperty({
    description: '标题',
  })
  title?: string;

  @ApiProperty({
    description: '内容',
  })
  content?: object;

  @ApiProperty({
    description: '空间id',
  })
  spaceId?: number | null;

  @ApiProperty({
    description: 'note tag id',
  })
  noteTagId?: number;
}
