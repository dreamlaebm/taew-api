import { Module } from '@nestjs/common';
import { SocialService } from './service/social.service';
import { FollowController } from './controller/follow.controller';
import { CommonModule } from '../common/index.module';
import { MyselfController } from './controller/myself.controller';
import { SocialController } from './controller/social.controller';

@Module({
  imports: [CommonModule],
  providers: [SocialService],
  controllers: [FollowController, MyselfController, SocialController],
})
export class UserModule {}
