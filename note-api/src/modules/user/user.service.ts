import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from 'src/common/utils/index.util';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from './dto/login-response.dto';
import moment from 'moment';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 新增
  async create(createUserDto: CreateUserDTO): Promise<User> {
    const user = await this.usersRepository.save(createUserDto);
    return await this.findOne(user.id);
  }

  // 根据id查询信息
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  // 根据id或id和userName查询信息
  async findByName(name: string, id: number): Promise<User> {
    const condition = { where: { name } };
    if (id) {
      condition['where']['id'] = id;
    }
    return await this.usersRepository.findOne(condition);
  }

  // 更新
  async update(userId: number, updateUserDto: UpdateUserDTO): Promise<User> {
    await this.usersRepository.update(userId, updateUserDto);
    return await this.findOne(userId);
  }

  async login(loginUserDto: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.usersRepository.findOne({
      where: {
        ...loginUserDto,
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
  }

  certificate(user: User): {
    token: string;
    expireAt: Date;
  } {
    const { id, name } = user;
    const payload = {
      id,
      name,
    };
    const token = this.jwtService.sign(payload);
    const expireAt = this.getExpirationTime(token);
    return {
      token: `Bearer ${token}`,
      expireAt,
    };
  }

  getExpirationTime(token: string): Date {
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken && typeof decodedToken['exp'] === 'number') {
      return new Date(decodedToken['exp'] * 1000);
    }
    return moment().add(30, 'days').toDate();
  }
}
