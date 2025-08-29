import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}