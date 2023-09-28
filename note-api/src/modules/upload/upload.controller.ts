import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
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
    await this.uploadService.uploadFile(
      env.MINIO_CONFIG.bucket,
      file.originalname,
      file.buffer,
    );
    return 'File uploaded successfully';
  }
}
