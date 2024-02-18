import { ApiProperty } from '@nestjs/swagger';

export class UserMutationResponse {
  @ApiProperty({ description: 'The api token' })
  public accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
