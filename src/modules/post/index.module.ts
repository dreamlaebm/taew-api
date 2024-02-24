import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { CommonModule } from '../common/index.module';

@Module({
  imports: [CommonModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
