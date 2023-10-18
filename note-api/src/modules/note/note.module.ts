import { Module, forwardRef } from '@nestjs/common';

import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { MenuModule } from '../menu/menu.module';
import { NoteTagModule } from '../note-tag/note-tag.module';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    forwardRef(() => MenuModule),
    forwardRef(() => NoteTagModule),
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
