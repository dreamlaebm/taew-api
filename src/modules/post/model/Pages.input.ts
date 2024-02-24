import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive, Length } from 'class-validator';

export class PagesInput {
  @ApiProperty({ description: 'The username' })
  @Length(2, 28)
  username: string;

  @ApiProperty({
    description: 'The page number',
    minimum: 1,
  })
  @IsPositive()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number;
}
