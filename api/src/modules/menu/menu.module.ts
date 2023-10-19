import { Module, forwardRef } from '@nestjs/common';

import { MenuService } from './menu.service';
import { DocModule } from '../doc/doc.module';
import { SpaceModule } from '../space/space.module';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    forwardRef(() => DocModule),
    forwardRef(() => SpaceModule),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
