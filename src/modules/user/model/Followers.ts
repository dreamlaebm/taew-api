import { ApiProperty } from '@nestjs/swagger';

export class Follower {
  @ApiProperty({ example: 'John Doe', required: false })
  displayName?: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;
}

export default class Followers {
  @ApiProperty({
    isArray: true,
    description: 'The peoples that the user follows',
    example: [{ displayName: 'John doe', username: 'johndoe' }],
  })
  following: Follower[];
  @ApiProperty({
    isArray: true,
    description: 'The peoples that the user is being followed',
    example: [{ displayName: 'Mary Doe', username: 'mary2024' }],
  })
  followedBy: Follower[];
}
