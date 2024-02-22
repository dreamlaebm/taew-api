import { ApiProperty } from '@nestjs/swagger';

export class UserInformation {
  @ApiProperty({ required: false, description: 'The display name' })
  displayName: string;

  @ApiProperty({ required: false, description: 'the user bios' })
  bio: string;

  @ApiProperty({ required: false, description: 'The user ID' })
  id: number;
}
