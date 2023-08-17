import { Module, forwardRef } from '@nestjs/common';
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
import { CategoryNoteModule } from './modules/category-note/category-note.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(env.DATABASE_CONFIG),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategoryNoteModule,
    CategoryModule,
    NoteModule,
    UserModule,
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
