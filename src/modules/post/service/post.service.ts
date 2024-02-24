import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/provider/prisma.service';
import { CreatePostDto } from '../model/CreatePost.input';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class UnknownReferralError extends Error {
  message = 'Unknown referral';
}

export class UnknownPostOrAlreadyDidAction extends Error {
  message = 'Unknown post or already did the action';
}

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  public constructor(private readonly prisma: PrismaService) {}

  async create(
    { id, username }: Pick<User, 'id' | 'username'>,
    postDto: CreatePostDto,
  ) {
    this.logger.verbose('Trying to create post', {
      whoCreated: { id, username },
      post: postDto,
    });
    try {
      const response = await this.prisma.post.create({
        data: {
          userId: id,
          ...postDto,
        },
      });

      return response.id;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2003') throw new UnknownReferralError();

        this.logger.error('Unhandled error code', error.code);

        throw error;
      }

      throw error;
    }
  }

  async like(
    { id: userId, username }: Pick<User, 'id' | 'username'>,
    postId: number,
  ) {
    this.logger.verbose('A user is liking a post', {
      who: { userId, username },
      postId: postId,
    });

    try {
      await this.prisma.post.update({
        where: {
          id: postId,
          NOT: {
            likedBy: {
              some: {
                id: userId,
              },
            },
          },
        },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2016') throw new UnknownPostOrAlreadyDidAction();
        this.logger.error('Unhandled error code', error.code);
        throw error;
      }
      throw error;
    }
  }

  async unlike(
    { id: userId, username }: Pick<User, 'id' | 'username'>,
    postId: number,
  ) {
    this.logger.verbose('A user is unliking a post', {
      who: { userId, username },
      postId: postId,
    });

    try {
      await this.prisma.post.update({
        where: {
          id: postId,

          likedBy: {
            some: {
              id: userId,
            },
          },
        },
        data: {
          likedBy: {
            disconnect: { id: userId },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025') throw new UnknownPostOrAlreadyDidAction();
        this.logger.error('Unhandled error code', error.code);
        throw error;
      }
      throw error;
    }
  }
}
