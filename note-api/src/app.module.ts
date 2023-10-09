import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './common/config';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';

import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { NoteModule } from './modules/note/note.module';
import { SpaceModule } from './modules/space/space.module';
import { MenuModule } from './modules/menu/menu.module';
import { UploadModule } from './modules/upload/upload.module';
import { LinkCheckModule } from './modules/link-check/link-check.module';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forRoot(env.DATABASE_CONFIG),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MenuModule,
    SpaceModule,
    NoteModule,
    UserModule,
    LinkCheckModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
