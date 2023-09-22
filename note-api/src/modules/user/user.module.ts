import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../common/config/index';
import { SpaceModule } from '../space/space.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register(env.JWT_CONFIG),
    forwardRef(() => SpaceModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
