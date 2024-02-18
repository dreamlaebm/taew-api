import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export default class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 32)
  @ApiProperty({
    nullable: true,
    minimum: 2,
    maximum: 32,
    example: 'Ryster Diffusion',
  })
  public displayName?: string;

  @IsNotEmpty()
  @Length(2, 28)
  @ApiProperty({ minimum: 2, maximum: 28, example: 'ryster' })
  public username: string;

  @IsEmail()
  @ApiProperty({ example: 'ryster@duck.com' })
  public email: string;

  @IsNotEmpty()
  @Length(8, 72)
  @ApiProperty({ minimum: 8, maximum: 72, example: 'popcorn@KEK12' })
  public password: string;
}
