import { ApiProperty } from '@nestjs/swagger';

export class CreatePostResponse {
  @ApiProperty({ description: 'The post id', required: true })
  public readonly id: number;
  constructor(id: number) {
    this.id = id;
  }
}
