import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export default class LoginUserDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  public email: string;

  @ApiProperty({ minimum: 8, maximum: 72, example: 'apple12345@SAUCE' })
  @Length(8, 72)
  public password: string;
}
