import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { DocModule } from './modules/doc/doc.module';
import { SpaceModule } from './modules/space/space.module';
import { MenuModule } from './modules/menu/menu.module';
import { UploadModule } from './modules/upload/upload.module';
import { LinkCheckModule } from './modules/link-check/link-check.module';
import { TagModule } from './modules/tag/tag.module';
import { DocTagModule } from './modules/doc-tag/doc-tag.module';
import configuration from './common/config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('mysql');
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MenuModule,
    SpaceModule,
    DocModule,
    UserModule,
    LinkCheckModule,
    TagModule,
    DocTagModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ConfigService,
    JwtStrategy,
  ],
})
export class AppModule {}
