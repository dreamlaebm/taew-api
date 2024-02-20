import { ApiProperty } from '@nestjs/swagger';

export class Pong {
  @ApiProperty({ description: 'always true', example: true })
  pong = true;
}
