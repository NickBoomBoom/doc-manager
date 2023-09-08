import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './common/config';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';

import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { NoteModule } from './modules/note/note.module';
import { CategoryModule } from './modules/category/category.module';
import { MenuModule } from './modules/menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(env.DATABASE_CONFIG),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MenuModule,
    CategoryModule,
    NoteModule,
    UserModule,
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
