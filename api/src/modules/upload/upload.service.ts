import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as Minio from 'minio';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import { fromBuffer } from 'file-type';

@Injectable()
export class UploadService {
  private minioClient: Minio.Client;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.minioClient = new Minio.Client({
      ...this.configService.get('minio'),
    });
  }

  async uploadFile(
    bucketName: string,
    file: any,
    userId: number,
  ): Promise<any> {
    const { size, originalname, buffer, mimetype } = file;
    const fileUrl = `${userId}/${moment().format(
      'YYYY-MM-DD/HH/mm',
    )}/${originalname}`;
    try {
      await this.minioClient.putObject(bucketName, fileUrl, buffer, {
        mimetype,
      });
    } catch (error) {
      throw new Error(error);
    }
    const url = `https://${this.configService.get(
      'minio.endPoint',
    )}/${bucketName}/${fileUrl}`;
    const names = originalname.split('.');
    const extension = names[names.length - 1];
    return {
      title: originalname,
      size: size,
      url,
      extension,
    };
  }

  async uploadFileByUrl(dto: any, userId: number, bucketName: string) {
    console.log(111, dto, userId);

    const response = await this.httpService
      .get(dto.url, {
        responseType: 'arraybuffer',
      })
      .toPromise();

    console.log(4444, response);
    const buffer = Buffer.from(response.data);
    const info = await fromBuffer(buffer);
    console.log(4444, info);
    const mimetype = info.mime;
    const ext = info.ext;
    const size = response.data.byteLength;

    // 生成文件名
    const originalname = `${uuid.v4()}.${ext}`;

    return this.uploadFile(
      bucketName,
      {
        buffer,
        size,
        originalname,
        mimetype,
      },
      userId,
    );
  }

  async bucket() {
    const res = await this.minioClient.listBuckets();
    return res;
  }

  // async sign(bucket: string, objectId: string) {
  //   const method = 'GET'
  //   const region = 'us-east-1'
  //   const expire = 5 * 60
  //   const reqOptions = client['getRequestOptions']({
  //     method,
  //     region,
  //     bucketName: bucket,
  //     objectName: objectId,
  //   })
  //   // presignSignatureV4(request, accessKey, secretKey, sessionToken, region, requestDate, expires)
  //   const presignedUrl = signing.presignSignatureV4(
  //     reqOptions,
  //     minioClientConfig.accessKey,
  //     minioClientConfig.secretKey,
  //     null,
  //     region,
  //     new Date(),
  //     expire,
  //   )
  //   return presignedUrl.replace(
  //     new RegExp(
  //       `http://${configService.minio.server}:${configService.minio.port}`,
  //     ),
  //     '',
  //   )
  // }
}
