import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.register({
      dest: './fileLibs', // 上传文件保存的目录
    }),
  ],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {}
