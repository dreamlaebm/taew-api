import { Module } from '@nestjs/common';
import { FollowService } from './service/follow.service';
import { FollowController } from './controller/follow.controller';
import { CommonModule } from '../common/index.module';

@Module({
  imports: [CommonModule],
  providers: [FollowService],
  controllers: [FollowController],
})
export class UserModule {}
