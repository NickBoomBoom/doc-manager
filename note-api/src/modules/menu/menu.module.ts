import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { NoteModule } from '../note/note.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    UserModule,
    CategoryModule,
    forwardRef(() => NoteModule),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
