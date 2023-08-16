import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { env } from 'src/common/config';

/**
 * @两种策略模式:1.jwt认证
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 请求被拒默认返回401未经授权的错误码
      secretOrKey: env.JWT_CONFIG.secret,
    });
  }

  async validate(payload: any) {
    return { id: +payload.id, name: payload.name, email: payload.email };
  }
}
