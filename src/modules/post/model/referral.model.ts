import { ApiProperty } from '@nestjs/swagger';

export class Referral {
  @ApiProperty()
  id: number;

  @ApiProperty()
  referralId: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  content: string;
}
