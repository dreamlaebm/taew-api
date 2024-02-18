import { Module } from "@nestjs/common";
import { PrismaService } from "./modules/common/provider/prisma.service";
import { RouterModule } from "@nestjs/core";
import { CommonModule } from "./modules/common/index.module";
import { TelemetryModule } from "./modules/telemetry/index.module";

@Module({
	imports: [CommonModule, TelemetryModule],
})
export class AppModule {}
