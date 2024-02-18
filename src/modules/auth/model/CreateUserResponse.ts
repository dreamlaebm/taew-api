import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty({ description: 'The api token' })
  public accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
