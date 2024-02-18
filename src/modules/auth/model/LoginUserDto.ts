import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export default class LoginUserDto {
  @ApiProperty({ example: 'ryster@duck.com' })
  @IsEmail()
  public email: string;

  @ApiProperty({ minimum: 8, maximum: 72, example: 'popcorn@KEK12' })
  @Length(8, 72)
  public password: string;
}
