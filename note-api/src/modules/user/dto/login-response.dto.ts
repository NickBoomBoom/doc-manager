import { User } from '../entities/user.entity';

export class LoginResponseDTO {
  user: User;
  token: string;
  expireAt: Date;
}
