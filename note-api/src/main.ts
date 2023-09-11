import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/config';
import { TransformInterceptor } from './common/interceptions/transform.interception';
import * as morgan from 'morgan';
import { HttpExceptionFilter } from './common/filters/http-execption.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用 morgan 中间件来记录 HTTP 请求
  app.use(morgan('combined'));
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(env.SERVICE_CONFIG.port);
}
bootstrap();
