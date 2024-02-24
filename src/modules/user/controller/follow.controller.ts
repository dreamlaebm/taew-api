import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AlreadyFollowingError,
  SocialService,
  UnknownAccountError,
} from '../service/social.service';
import {
  MustAuth,
  User,
  UsersFromTokenPipe,
  WithToken,
} from 'src/modules/auth/flow/users.pipe';
import Followers from '../model/Followers';

@Controller('/api/user')
@ApiTags('follow')
export class FollowController {
  public constructor(private readonly socialService: SocialService) {}

  @Post(':username/follow')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'You followed the user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Couldnt find the user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'You are already following the user',
  })
  @ApiParam({ name: 'username', description: 'the username to follow' })
  @MustAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async follow(
    @WithToken(UsersFromTokenPipe) user: User,
    @Param('username') username: string,
  ) {
    try {
      await this.socialService.followUser(user, username);
    } catch (error) {
      if (error instanceof UnknownAccountError)
        throw new NotFoundException('NO_SUCH_ACCOUNT');

      if (error instanceof AlreadyFollowingError)
        throw new BadRequestException('ALREADY_FOLLOWING');

      throw error;
    }
  }

  @Post(':username/unfollow')
  @ApiOperation({ summary: 'Unfollow the user' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Couldnt find the user or not following the account',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'You unfollowed the target account',
  })
  @MustAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @WithToken(UsersFromTokenPipe) user: User,
    @Param('username') username: string,
  ) {
    try {
      await this.socialService.unfollow(user, username);
    } catch (error) {
      if (error instanceof UnknownAccountError)
        throw new NotFoundException('NO_SUCH_ACCOUNT_OR_NOT_FOLLOWING');

      throw error;
    }
  }

  @Get(':username/followers')
  @ApiOperation({ summary: 'Get the user followers' })
  @ApiResponse({ status: HttpStatus.OK, type: Followers })
  async followers(@Param('username') username: string): Promise<Followers> {
    return await this.socialService.followers(username);
  }
}
