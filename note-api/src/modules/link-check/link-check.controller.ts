import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
@Controller('linkcheck')
export class LinkCheckController {
  @Public()
  @Post('1/check')
  async check1(@Query('id') id: string) {
    console.log(1211, id);
    return true;
  }
  @Post()
  async check(@Query('id') id: string) {
    console.log(1211, id);
    return true;
  }
}
