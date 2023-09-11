import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorator/public.decorator';
import path from 'path';
@Controller('upload')
export class UploadController {
  @Public()
  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    // TODO: 想想怎么接
    // 处理上传的文件，你可以在这里保存文件，处理它，等等
    console.log(2111, file, body);
    // 获取上传文件的信息
    // const fileName = file.originalname; // 获取上传的文件名
    // const filePath = path.join(__dirname, '..', 'uploads', fileName); // 构建文件路径

    // // 处理上传的文件和其他字段
    // console.log(fileName); // 上传的文件名
    // console.log(filePath); // 文件的完整路径

    return {
      location: `https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF`,
    };
  }
}
