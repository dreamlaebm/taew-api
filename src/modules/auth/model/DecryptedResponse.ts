import { ApiProperty } from '@nestjs/swagger';

export default class DecryptedAccount {
  @ApiProperty({
    description: 'The display name',
    example: 'John Doe',
    required: false,
  })
  public displayName?: string;

  @ApiProperty({
    description: 'The username',
    example: 'johndoe',
  })
  public username: string;

  @ApiProperty({
    description: 'The id',
    example: 1,
  })
  public id: number;

  public constructor(id: number, username: string, displayName?: string) {
    this.id = id;
    this.displayName = displayName;
    this.username = username;
  }
}
