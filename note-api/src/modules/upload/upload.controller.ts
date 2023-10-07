import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorator/public.decorator';
import { UploadService } from './upload.service';
import { env } from '../../common/config';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    console.log(1111, file);
    const metaData = {
      'Content-Type': file.mimetype,
    };
    await this.uploadService.uploadFile(
      env.MINIO_CONFIG.bucket,
      file.originalname,
      file.buffer,
      metaData,
    );
    return 'File uploaded successfully';
  }

  @Public()
  @Get()
  async get() {
    return await this.uploadService.bucket();
  }
}
