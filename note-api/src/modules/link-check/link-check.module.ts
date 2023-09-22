import { Module } from '@nestjs/common';
import { LinkCheckController } from './link-check.controller';
@Module({
  imports: [],
  controllers: [LinkCheckController],
  providers: [],
  exports: [],
})
export class LinkCheckModule {}
