import { Module, forwardRef } from '@nestjs/common';

import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { MenuModule } from '../menu/menu.module';
import { DocTagModule } from '../doc-tag/doc-tag.module';
import { Doc } from './entities/doc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doc]),
    forwardRef(() => MenuModule),
    forwardRef(() => DocTagModule),
  ],
  controllers: [DocController],
  providers: [DocService],
  exports: [DocService],
})
export class DocModule {}
