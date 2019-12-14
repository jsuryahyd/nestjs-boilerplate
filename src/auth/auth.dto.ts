import { IsEmail, IsDefined } from 'class-validator';

export class AdminLoginDto {
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  pwd: string;
}
