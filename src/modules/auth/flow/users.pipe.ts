import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  PipeTransform,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/common/provider/prisma.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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

      return await this.prisma.user.findUniqueOrThrow({
        where: {
          accessToken: payload.token,
          username: payload.username,
        },
      });
    } catch (error) {
      this.logger.warn('Unable to authenticate user', error);
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

/**
 * @brief Adds the API documentation needed for authenticated requests
 */
export function MustAuth() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Your Authorization is either invalid or expired',
    })(target, propertyKey, descriptor);

    ApiBearerAuth()(target, propertyKey, descriptor);
  };
}
