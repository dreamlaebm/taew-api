import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MustAuth,
  User,
  UsersFromTokenPipe,
  WithToken,
} from 'src/modules/auth/flow/users.pipe';
import { CreatePostDto } from '../model/CreatePost.input';
import {
  NoPostsAvaliable,
  PostService,
  UnknownPostOrAlreadyDidAction,
  UnknownReferralError,
} from '../service/post.service';
import { CreatePostResponse } from '../model/CreatePost.output';
import { AvaliablePages } from '../model/AvaliablePages.output';
import { PagesInput } from '../model/Pages.input';
import { Post as PostModel } from '../model/post.model';

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

  @Get(':username/posts/:page')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @ApiOkResponse({ type: PostModel })
  async list(@Param() { username, page }: PagesInput) {
    return await this.postService.listByPage(username, page);
  }

  @Get(':username/avaliable-pages')
  @ApiResponse({ status: HttpStatus.OK, type: AvaliablePages })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unable to find any posts related to :username',
  })
  async avaliablePages(@Param('username') username: string) {
    try {
      const avaliablePages = await this.postService.avaliablePages(username);

      return new AvaliablePages(avaliablePages);
    } catch (error) {
      if (error instanceof NoPostsAvaliable)
        throw new NotFoundException('NO_POSTS_AVALIABLE');
    }
  }
}
