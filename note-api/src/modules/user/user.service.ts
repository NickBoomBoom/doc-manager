import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from './dto/login-response.dto';
import moment from 'moment';
import { CategoryService } from '../category/category.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  // 新增
  async create(createUserDto: CreateUserDTO): Promise<LoginResponseDTO> {
    const user = await this.usersRepository.save(createUserDto);
    const rootCategory = await this.categoryService.create(+user.id, {
      name: '根目录',
      parentId: null,
      updateAt: new Date(),
    });
    const { email, password } = await this.update(user.id, {
      rootCategoryId: rootCategory.id,
      updateAt: new Date(),
    });

    return await this.login({
      email,
      password,
    });
  }

  // 根据id查询信息
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  // 更新
  async update(userId: number, updateUserDto: UpdateUserDTO): Promise<User> {
    await this.usersRepository.update(userId, updateUserDto);
    return await this.findOne(userId);
  }

  async login(loginUserDto: LoginUserDTO): Promise<LoginResponseDTO> {
    const { name, email, password } = loginUserDto;
    const isExist = await this.checkEmail(loginUserDto.email);
    if (isExist) {
      const user = await this.usersRepository.findOne({
        where: {
          email,
          password,
        },
      });

      if (!user) {
        throw new Error('账号或密码错误');
      }
      const loginInfo = await this.certificate(user);
      const res = {
        user,
        ...loginInfo,
      };
      return res;
    } else {
      return await this.create(loginUserDto as CreateUserDTO);
    }
  }

  certificate(user: User): {
    token: string;
    expires: number;
  } {
    const { id, name, email, rootCategoryId } = user;
    const payload = {
      id,
      name,
      email,
      rootCategoryId,
    };
    const token = this.jwtService.sign(payload);
    return {
      token: `Bearer ${token}`,
      expires: 7,
    };
  }

  async checkEmail(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({
      where: {
        email,
      },
    });
    return !!count;
  }
}
