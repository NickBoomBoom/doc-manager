import { Module } from '@nestjs/common';

import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { MenuModule } from '../menu/menu.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Space]), MenuModule],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
