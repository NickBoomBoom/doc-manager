import { Module, forwardRef } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryNoteModule } from '../category-note/category-note.module';
@Module({
  imports: [TypeOrmModule.forFeature([Category]), CategoryNoteModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
