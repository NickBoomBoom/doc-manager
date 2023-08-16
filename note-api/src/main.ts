import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/config';
import { TransformInterceptor } from './common/interceptions/transform.interception';
import { HttpExceptionFilter } from './common/filters/http-execption.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(env.SERVICE_CONFIG.port);
}
bootstrap();
