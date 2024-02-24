import { ApiProperty } from '@nestjs/swagger';
import { Author } from './author.model';
import { Referral } from './referral.model';

export class Comment {
  @ApiProperty()
  authorId: number;

  @ApiProperty({ type: Author })
  author: Author;

  @ApiProperty({ type: Referral })
  referral: Referral;
}
