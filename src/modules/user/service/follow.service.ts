import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/modules/common/provider/prisma.service';
import Followers from '../model/Followers';
import { UserInformation } from '../model/UserInformation';

export class UnknownAccountError extends Error {
  message = 'Unable to find account';
}

export class AlreadyFollowingError extends Error {
  message = 'You are already following the user';
}

export class NotFollowingError extends Error {
  message = 'You arent following the user';
}

@Injectable()
export class FollowService {
  public constructor(private prisma: PrismaService) {}

  async unfollow(user: User, username: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: user.id,

          following: {
            some: {
              username,
            },
          },
        },
        data: {
          following: {
            disconnect: { username },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025') throw new UnknownAccountError();
        if (error.code == 'P2016') throw new NotFollowingError();
      }
      throw error;
    }
  }

  async followers(username: string): Promise<Followers> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },

      select: {
        followedBy: {
          select: {
            displayName: true,
            username: true,
          },
        },
        following: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
    });

    return user;
  }

  async info(username: string): Promise<UserInformation> {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          username,
        },
      });

      return {
        bio: result.bio,
        displayName: result.displayName,
        id: result.id,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025') throw new UnknownAccountError();
      }
    }
  }

  async followUser(user: User, username: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: user.id,
          NOT: {
            following: {
              some: {
                username,
              },
            },
          },
        },
        data: {
          following: {
            connect: { username },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025') throw new UnknownAccountError();
        if (error.code == 'P2016') throw new AlreadyFollowingError();
      }
      throw error;
    }
  }
}
