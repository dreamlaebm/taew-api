import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AvaliablePages {
  @ApiProperty({
    description: 'The avaliable pages count',
    example: 4,
    minimum: 1,
  })
  @IsPositive()
  @IsNumber()
  public avaliablePages: number;

  public constructor(avaliablePages: number) {
    this.avaliablePages = avaliablePages;
  }
}
