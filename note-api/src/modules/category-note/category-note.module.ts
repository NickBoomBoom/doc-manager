import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryNote } from './entities/category-note.entity';
import { CategoryNoteService } from './category-note.service';
import { NoteModule } from '../note/note.module';
import { CategoryModule } from '../category/category.module';
import { CategoryNoteController } from './category-note.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryNote]),
    forwardRef(() => NoteModule),
    forwardRef(() => CategoryModule),
  ],
  controllers: [CategoryNoteController],
  providers: [CategoryNoteService],
  exports: [CategoryNoteService],
})
export class CategoryNoteModule {}
