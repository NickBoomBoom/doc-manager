import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorator/public.decorator';
import { UploadService } from './upload.service';
import { env } from '../../common/config';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
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
      env.MINIO_CONFIG.bucket,
      file,
      userId,
    );
  }

  @Get()
  async get() {
    return await this.uploadService.bucket();
  }
}
