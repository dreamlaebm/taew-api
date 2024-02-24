// models/author.model.ts
import { ApiProperty } from '@nestjs/swagger';

export class Author {
  @ApiProperty()
  displayName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  id: number;
}
