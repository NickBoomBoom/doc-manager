import { Module, forwardRef } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UserModule } from '../user/user.module';
import { NoteModule } from '../note/note.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => NoteModule),
    UserModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
