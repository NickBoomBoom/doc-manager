import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/common/dto/base.dto';
export class NoteTagDTO extends BaseDTO {
  @ApiProperty({
    description: '标签ids',
    example: '1,2,3',
  })
  tagIds: string;

  @ApiProperty({
    description: 'noteId',
    example: '1',
  })
  noteId: number;
}
