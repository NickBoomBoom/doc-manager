import { Injectable } from '@nestjs/common';
import { env } from '../../common/config';
import * as Minio from 'minio';
import * as moment from 'moment';
@Injectable()
export class UploadService {
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: env.MINIO_CONFIG.endPoint,
      port: env.MINIO_CONFIG.port,
      useSSL: false,
      accessKey: env.MINIO_CONFIG.accessKey,
      secretKey: env.MINIO_CONFIG.secretKey,
    });
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    data: Buffer,
    metaData: any,
    userId: number,
  ): Promise<any> {
    const fileUrl = `${userId}/${moment().format(
      'YYYY-MM-DD/HH:mm',
    )}/${objectName}`;
    await this.minioClient.putObject(bucketName, fileUrl, data, metaData);

    return await this.minioClient.getObject(bucketName, fileUrl);
    const policy = 'http:';
    //  http://localhost:9001/note/1/2023-10-07/16:32/startButton.png
    return (
      policy +
      env.MINIO_CONFIG.endPoint +
      ':' +
      env.MINIO_CONFIG.port +
      '/' +
      bucketName +
      '/' +
      fileUrl
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
