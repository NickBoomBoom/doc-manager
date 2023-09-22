import { Module } from '@nestjs/common';
import { Space } from './entities/space.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { MenuModule } from '../menu/menu.module';
@Module({
  imports: [TypeOrmModule.forFeature([Space]), MenuModule],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
