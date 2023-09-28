import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from '../../common/config';
import { Repository } from 'typeorm';
import * as Minio from 'minio';
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
      // bucket: env.MINIO_CONFIG.bucket
    });
  }

  async uploadFile(bucketName: string, objectName: string, data: Buffer) {
    console.log(33333, bucketName);
    await this.minioClient.putObject(bucketName, objectName, data);
  }
}
