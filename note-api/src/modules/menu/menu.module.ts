import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';
import { NoteModule } from '../note/note.module';
import { CategoryModule } from '../category/category.module';
import { MenuController } from './menu.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    forwardRef(() => NoteModule),
    forwardRef(() => CategoryModule),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
