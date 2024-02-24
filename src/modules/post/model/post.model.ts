import { ApiProperty } from '@nestjs/swagger';
import { Author } from './author.model';
import { Comment } from './comment.model';
import { Referral } from './referral.model';

export class Post {
  @ApiProperty()
  id: number;

  @ApiProperty()
  referralId: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: Author })
  author: Author;

  @ApiProperty({ type: [Author] })
  likedBy: Author[];

  @ApiProperty({ type: [Comment] })
  comments: Comment[];

  @ApiProperty({ type: Referral })
  referral: Referral;
}
