import { Module } from "@nestjs/common";
import { PrismaService } from "./provider/prisma.service";

@Module({
	providers: [PrismaService],
})
export class CommonModule {}
