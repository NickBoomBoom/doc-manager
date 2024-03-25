import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptions/transform.interception';
import * as morgan from 'morgan';
import { HttpExceptionFilter } from './common/filters/http-execption.filters';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // 使用 morgan 中间件来记录 HTTP 请求
  app.use(morgan('combined'));
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  /* 启动swagger */
  const options = new DocumentBuilder()
    .addBearerAuth() // 开启 BearerAuth 授权认证
    .setTitle('API 文档')
    .setDescription('API 文档')
    .setTermsOfService('https://docs.nestjs.cn/8/introduction')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 设置显示路由
  SwaggerModule.setup('/api', app, document);

  await app.listen(configService.get('base.port'));
}
bootstrap();
