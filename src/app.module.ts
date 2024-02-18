import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/index.module';
import { TelemetryModule } from './modules/telemetry/index.module';
import { AuthModule } from './modules/auth/index.module';

@Module({
  imports: [CommonModule, TelemetryModule, AuthModule],
})
export class AppModule {}
