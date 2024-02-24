import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    required: true,
    description: 'The post contents',
    example: 'How are yall felling today?',
  })
  @IsString()
  @Length(2, 350)
  content: string;

  @ApiProperty({
    nullable: true,
    required: false,
    example: null,
    description: 'The post that you are referring to',
  })
  referralId?: number = null;
}
