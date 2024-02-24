import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
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
import {
  PostService,
  UnknownPostOrAlreadyDidAction,
  UnknownReferralError,
} from '../service/post.service';
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

  @Post(':postId/like')
  @MustAuth()
  @ApiOperation({ summary: 'Likes a post' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Liked the post' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'You already liked the post or the post doesnt exist',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async like(
    @WithToken(UsersFromTokenPipe) user: User,
    @Param('postId') postId: string,
  ) {
    try {
      await this.postService.like(user, Number(postId));
    } catch (error) {
      if (error instanceof UnknownPostOrAlreadyDidAction)
        throw new ConflictException('ALREADY_LIKED_OR_POST_DOESNT_EXIST');
      throw error;
    }
  }

  @Post(':postId/unlike')
  @MustAuth()
  @ApiOperation({ summary: 'Unlikes a post' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Unliked the post',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'You already unliked the post or the post doesnt exist',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlike(
    @WithToken(UsersFromTokenPipe) user: User,
    @Param('postId') postId: string,
  ) {
    try {
      await this.postService.unlike(user, Number(postId));
    } catch (error) {
      if (error instanceof UnknownPostOrAlreadyDidAction)
        throw new ConflictException('ALREADY_UNLIKED_OR_POST_DOESNT_EXIST');
      throw error;
    }
  }
}
