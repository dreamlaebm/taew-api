import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from '../model/CreateUserDto';
import { CreateUserResponse } from '../model/CreateUserResponse';
import { UserAlreadyExistsError, UserService } from '../service/UserService';

@Controller('/api/auth')
@ApiTags('authentication')
export default class UserController {
  private readonly logger = new Logger(UserController.name);

  public constructor(private readonly userService: UserService) {}

  @Post('createUser')
  @ApiOperation({ summary: 'Registers a new user' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: HttpStatus.OK, type: CreateUserResponse })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user already exists',
  })
  @HttpCode(HttpStatus.OK)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    try {
      const token = await this.userService.createUser(createUserDto);
      return new CreateUserResponse(token);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError)
        throw new BadRequestException('USER_ALREADY_EXISTS');

      this.logger.error(`UNABLE TO CREATE USER!`, error);

      throw new InternalServerErrorException('UNKN_ERROR');
    }
  }
}
