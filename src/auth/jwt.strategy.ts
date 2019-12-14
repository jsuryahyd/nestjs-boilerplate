import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        req => {
          return (req.headers.cookie || '').split('jwt=')[1];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   *
   * @description parses the token(payload) and attaches a `user` object(returned here) to req,
   */
  async validate({user,exp,iat}: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userRoles:user.userRoles
    };
  }
}
