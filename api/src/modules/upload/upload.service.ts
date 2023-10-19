import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UploadService {
  private readonly minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      ...this.configService.get('minio'),
      useSSL: false,
    });
  }

  async uploadFile(
    bucketName: string,
    file: any,
    userId: number,
  ): Promise<any> {
    const { size, originalname, buffer, mimetype } = file;
    const fileUrl = `${userId}/${moment().format(
      'YYYY-MM-DD/HH:mm',
    )}/${originalname}`;
    await this.minioClient.putObject(bucketName, fileUrl, buffer, {
      mimetype,
    });
    //  http://localhost:9001/doc/1/2023-10-07/16:32/startButton.png
    const url = `http://${this.configService.get(
      'minio.endPoint',
    )}:${this.configService.get('minio.port')}/${bucketName}/${fileUrl}`;
    const names = originalname.split('.');
    const extension = names[names.length - 1];
    return {
      title: originalname,
      size: size,
      url,
      extension,
    };
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
