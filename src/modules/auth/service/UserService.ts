import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/provider/prisma.service';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import CreateUserDto from '../model/CreateUserDto';
import LoginUserDto from '../model/LoginUserDto';

export class UserAlreadyExistsError extends Error {}

export class UserNotFoundError extends Error {
  message: string = 'User not found';
}

export class CredentialMismatch extends Error {
  message: string = 'Credential Mismatch';
}

@Injectable()
export class UserService {
  public constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async login(
    { email, password }: LoginUserDto,
    refreshes?: boolean,
  ): Promise<string> {
    const account = await this.prisma.user.findFirst({
      where: {
        email,
        password: refreshes ? password : undefined,
      },
    });

    if (!account) throw new UserNotFoundError();

    if (!refreshes) {
      const matches = await verify(account.password, password);

      if (!matches) throw new CredentialMismatch();
    }

    return await this.jwtService.signAsync({
      token: account.accessToken,
      id: account.id,
      username: account.username,
    });
  }

  public async create(createUserDto: CreateUserDto) {
    const accessToken = randomBytes(32).toString('hex');

    try {
      const data: Prisma.UserCreateInput = {
        accessToken,
        ...createUserDto,
      };

      data.password = await hash(data.password);

      const {
        accessToken: token,
        id,
        username,
      } = await this.prisma.user.create({
        data,
      });

      return await this.jwtService.signAsync({
        token,
        id,
        username,
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
      if (error.code == 'P2002') throw new UserAlreadyExistsError();
      throw error;
    }
  }
}
