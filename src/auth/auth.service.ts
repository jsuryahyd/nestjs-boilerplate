import { Injectable } from '@nestjs/common';
import { until } from '../utils/helpers';
import { getRepository } from 'typeorm';
import { User } from '../entities/users.entity';
import { JwtService } from '@nestjs/jwt';

import { hash,compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  // constructor(private readonly jwtService: JwtService) {}
  constructor() {}

  async getUserByEmail(email) {
    const [err, user] = await until(
      getRepository(User).findOneOrFail({ where: { email } ,relations:['userRoles']}),
    );
    if (err) throw err;
    return user;
  }

  async hashStr(pwd) :Promise<string>{
    const [err, hashedStr] = await until(hash(pwd, 10));
    if (err) throw err;
    return hashedStr;
  }

  async compareWithHash(str,hashedStr) :Promise<Boolean>{
    const [err, isEqual] = await until(compare(str, hashedStr));
    if (err) throw err;
    return isEqual;
  }
}
