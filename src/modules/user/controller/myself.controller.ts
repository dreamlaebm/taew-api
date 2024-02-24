import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  MustAuth,
  User,
  UsersFromTokenPipe,
  WithToken,
} from 'src/modules/auth/flow/users.pipe';
import { UpdateUserDto } from '../model/UpdateUser.input';
import { SocialService } from '../service/social.service';

@Controller('/api/me')
@ApiTags('myself')
@UsePipes(new ValidationPipe({ transform: true }))
export class MyselfController {
  public constructor(private readonly socialService: SocialService) {}

  @Put('update')
  @ApiOperation({ summary: 'Updates the user information' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Changes accepted',
  })
  @MustAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @WithToken(UsersFromTokenPipe) user: User,
    @Body() updateData: UpdateUserDto,
  ): Promise<void> {
    await this.socialService.update(user, updateData);
  }
}
