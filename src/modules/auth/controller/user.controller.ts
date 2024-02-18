import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from '../model/CreateUserDto';
import { UserMutationResponse } from '../model/CreateUserResponse';
import {
  CredentialMismatch,
  UserAlreadyExistsError,
  UserNotFoundError,
  UserService,
} from '../service/UserService';
import LoginUserDto from '../model/LoginUserDto';

@Controller('/api/auth')
@ApiTags('authentication')
export default class UserController {
  private readonly logger = new Logger(UserController.name);

  public constructor(private readonly userService: UserService) {}

  @Post('createUser')
  @ApiOperation({ summary: 'Creates a new user' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: HttpStatus.OK, type: UserMutationResponse })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user already exists',
  })
  @HttpCode(HttpStatus.OK)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserMutationResponse> {
    try {
      const token = await this.userService.create(createUserDto);
      return new UserMutationResponse(token);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError)
        throw new BadRequestException('USER_ALREADY_EXISTS');

      this.logger.error(`UNABLE TO CREATE USER!`, error);

      throw new InternalServerErrorException('UNKN_ERROR');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login into a user' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: HttpStatus.OK, type: UserMutationResponse })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The password mismatches',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Couldn't find the user",
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginUserDto): Promise<UserMutationResponse> {
    try {
      const token = await this.userService.login(payload);
      return new UserMutationResponse(token);
    } catch (error) {
      if (error instanceof UserNotFoundError)
        throw new NotFoundException('USER_NOT_FOUND');
      if (error instanceof CredentialMismatch)
        throw new UnauthorizedException('CRENDENTIAL_MISMATCHES');
      throw error;
    }
  }
}
