import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(2, 32)
  @IsOptional()
  @ApiProperty({
    nullable: true,
    minimum: 2,
    maximum: 32,
    example: 'John Doe',
  })
  public displayName?: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 150)
  @ApiProperty({
    nullable: true,
    minimum: 1,
    maximum: 150,
    example: 'I am Joe Doe, a guy that like cats',
  })
  public bio?: string;
}
