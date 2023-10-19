import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
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

  @ApiProperty({
    description: 'userId',
    example: '1',
  })
  userId: number;
}
