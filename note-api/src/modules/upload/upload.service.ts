import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from '../../common/config';
import { Repository } from 'typeorm';
import * as Minio from 'minio';
@Injectable()
export class UploadService {
  private readonly minioClient: Minio.Client;

  constructor() {
    console.log(1111, env.MINIO_CONFIG);
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
  ) {
    await this.minioClient.putObject(bucketName, objectName, data, metaData);
  }

  async bucket() {
    const res = await this.minioClient.listBuckets();

    console.log(6666, res);
    return res;
  }
}
