import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  Res,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminLoginDto } from './auth.dto';
import { until } from '../utils/helpers';
import { getRepository } from 'typeorm';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { errorLog } from '../utils/logger';
import { classToPlain } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('admin-login')
  async authorizeAdmin(
    @Body() { email, pwd: password }: AdminLoginDto,
    @Res() res,
  ) {
    //get the user from db
    const [err, user] = await until(this.authService.getUserByEmail(email));
    if (err) {
      errorLog.error(err);
      if (err.name && err.name == 'EntityNotFound')
        throw new HttpException(
          { message: 'No User found with given email.' },
          HttpStatus.NOT_FOUND,
        );
      throw new InternalServerErrorException(
        'An error occured while authentication.',
      );
    }
   
    //check password
    const [compareErr, isPwdEqual] = await until(
      this.authService.compareWithHash(password, user.password),
    );
    if (compareErr)
      throw new InternalServerErrorException(
        'An Error Occured while authentication',
      );

    if (!isPwdEqual) {
      throw new UnauthorizedException('Password doesnot match');
    }

    //user is a typeorm object, convert into object literal
    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userRoles: user.userRoles.map(r => classToPlain(r)),
    };
    const jwt = this.jwtService.sign({ user });
    // return { success: true };
    res.cookie('jwt', jwt, { secure: false, httpOnly: true,  }); //todo: make this true, when https is enabled, also `sameSite: true` when deployed
    res.json({ success: true });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('is-admin-logged-in')
  async isAdminAndIsLoggedIn(@Req() req) {
    const user = req.user;
    if (!user) return { loggedIn: false };
    // if(!user.role == "admin") return {isLoggedIn:true,isAdmin:false}
    return {
      isLoggedIn: true,
      isAdmin: !!user.userRoles.find(r => r.title == 'ADMIN'),
      user,
    };
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('admin-logout')
  async logoutAdmin(@Req() req,@Res() res) {
    res.cookie('jwt','',{maxAge:Date.now()})
    res.send({success:true})
  }
}
