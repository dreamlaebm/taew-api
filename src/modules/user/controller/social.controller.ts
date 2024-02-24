import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInformation } from '../model/UserInformation';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { SocialService, UnknownAccountError } from '../service/social.service';

@Controller('/api/user')
@ApiTags('social')
export class SocialController {
  public constructor(private readonly socialService: SocialService) {}

  @Get(':username/info')
  @ApiOperation({ summary: 'Get user information' })
  @ApiResponse({ status: HttpStatus.OK, type: UserInformation })
  async info(@Param('username') username: string): Promise<UserInformation> {
    try {
      return await this.socialService.info(username);
    } catch (error) {
      if (error instanceof UnknownAccountError)
        throw new NotFoundException('NO_SUCH_ACCOUNT');
      throw error;
    }
  }
}
