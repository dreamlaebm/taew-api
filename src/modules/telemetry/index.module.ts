import { Module } from '@nestjs/common';
import { PingService } from './service/ping.service';
import { PingController } from './controller/ping.controller';

@Module({
  providers: [PingService],
  controllers: [PingController],
})
export class TelemetryModule {}
