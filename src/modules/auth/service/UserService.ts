import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/provider/prisma.service';
import CreateUserDto from '../model/CreateUserDto';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';

export class UserAlreadyExistsError extends Error {}

@Injectable()
export class UserService {
  public constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const accessToken = randomBytes(32).toString('hex');

    try {
      const data: Prisma.UserCreateInput = {
        accessToken,
        ...createUserDto,
      };

      data.password = await hash(data.password);

      const newUser = await this.prisma.user.create({
        data,
      });

      return await this.jwtService.signAsync({
        token: newUser.accessToken,
        id: newUser.id,
        username: newUser.username,
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
      if (error.code == 'P2002') throw new UserAlreadyExistsError();
      throw error;
    }
  }
}
