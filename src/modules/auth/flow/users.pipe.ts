import {
  ExecutionContext,
  Injectable,
  Logger,
  PipeTransform,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/common/provider/prisma.service';
import { User } from '@prisma/client';
export { User };

@Injectable()
export class UsersFromTokenPipe implements PipeTransform {
  private readonly logger = new Logger(UsersFromTokenPipe.name);

  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async transform(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      return await this.prisma.user.findFirstOrThrow({
        where: {
          accessToken: payload.token,
          username: payload.username,
        },
      });
    } catch (error) {
      this.logger.warn('unable to authenticate user', error);
      throw new UnauthorizedException('Invalid account');
    }
  }
}

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export const WithToken = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Missing Authorization Header');

    return token;
  },
);
