import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  MustAuth,
  User,
  UsersFromTokenPipe,
  WithToken,
} from 'src/modules/auth/flow/users.pipe';
import { CreatePostDto } from '../model/CreatePost.input';
import { PostService, UnknownReferralError } from '../service/post.service';
import { CreatePostResponse } from '../model/CreatePost.output';

@ApiTags('post')
@Controller('/api/post')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Post('create')
  @MustAuth()
  @ApiOperation({ summary: 'Creates a post' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The referral post doesnt exist',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created the post',
    type: CreatePostResponse,
  })
  @HttpCode(HttpStatus.OK)
  async create(
    @WithToken(UsersFromTokenPipe) user: User,
    @Body() bodyDto: CreatePostDto,
  ) {
    try {
      const resultPostId = await this.postService.create(user, bodyDto);

      return new CreatePostResponse(resultPostId);
    } catch (error) {
      if (error instanceof UnknownReferralError)
        throw new NotFoundException('REFERRAL_POST_DOESNT_EXIST');

      throw error;
    }
  }
}
