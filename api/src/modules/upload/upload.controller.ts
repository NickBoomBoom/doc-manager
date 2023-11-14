import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Request,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/decorator/public.decorator';
@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private configService: ConfigService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Request() request,
  ): Promise<any> {
    const {
      user: { id: userId },
    } = request;

    return await this.uploadService.uploadFile(
      this.configService.get('minio.bucket'),
      file,
      userId,
    );
  }

  @Post('url')
  async uploadFileByUrl(@Request() request, @Body() dto: any) {
    const {
      user: { id: userId },
    } = request;
    return this.uploadService.uploadFileByUrl(
      dto,
      userId,
      this.configService.get('minio.bucket'),
    );
  }

  @Get()
  async get() {
    return await this.uploadService.bucket();
  }
}
