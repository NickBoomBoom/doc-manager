import { Module, forwardRef } from '@nestjs/common';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { CategoryNoteModule } from '../category-note/category-note.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    forwardRef(() => CategoryNoteModule),
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
