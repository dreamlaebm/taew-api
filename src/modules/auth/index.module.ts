import { Module } from '@nestjs/common';
import UserController from './controller/user.controller';
import { UserService } from './service/UserService';
import { CommonModule } from '../common/index.module';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AuthModule {}
