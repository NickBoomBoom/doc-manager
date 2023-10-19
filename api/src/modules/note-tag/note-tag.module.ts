import { Module } from '@nestjs/common';

import { NoteTagController } from './note-tag.controller';
import { NoteTagService } from './note-tag.service';
import { TagModule } from '../tag/tag.module';
import { NoteTag } from './entities/note-tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([NoteTag]), TagModule],
  controllers: [NoteTagController],
  providers: [NoteTagService],
  exports: [NoteTagService],
})
export class NoteTagModule {}
