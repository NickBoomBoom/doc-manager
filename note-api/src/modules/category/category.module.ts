import { Module, forwardRef } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MenuModule } from '../menu/menu.module';
@Module({
  imports: [TypeOrmModule.forFeature([Category]), MenuModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
