import { Controller, Get, HttpStatus } from "@nestjs/common";
import { PingService } from "../service/ping.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

class Pong {
	public readonly pong: boolean;
}

@Controller("/api/telemetry")
@ApiTags("telemetry")
export class PingController {
	public constructor(private readonly pingService: PingService) {}

	@Get("/ping")
	@ApiOperation({ summary: "Verify if the server is OK" })
	@ApiResponse({ status: HttpStatus.OK, type: Pong })
	public async getPing() {
		return this.pingService.getPing();
	}
}
