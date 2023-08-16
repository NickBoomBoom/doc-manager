import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../common/config/index';
import { CategoryModule } from '../category/category.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register(env.JWT_CONFIG),
    forwardRef(() => CategoryModule),
    // CategoryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
