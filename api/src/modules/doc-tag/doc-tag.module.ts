import { Module } from '@nestjs/common';

import { DocTagController } from './doc-tag.controller';
import { DocTagService } from './doc-tag.service';
import { TagModule } from '../tag/tag.module';
import { DocTag } from './entities/doc-tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([DocTag]), TagModule],
  controllers: [DocTagController],
  providers: [DocTagService],
  exports: [DocTagService],
})
export class DocTagModule {}
