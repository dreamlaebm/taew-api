import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PingService } from '../service/ping.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pong } from '../model/pong';

@Controller('/api/telemetry')
@ApiTags('telemetry')
export class PingController {
  public constructor(private readonly pingService: PingService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Verify if the server is OK' })
  @ApiResponse({ status: HttpStatus.OK, type: Pong })
  public getPing(): Pong {
    return this.pingService.getPing();
  }
}
