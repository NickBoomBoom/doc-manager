import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './common/config';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';

import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { NoteModule } from './modules/note/note.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(env.DATABASE_CONFIG),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register(env.JWT_CONFIG),
    UserModule,
    CategoryModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
