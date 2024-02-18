import { Injectable } from "@nestjs/common";
import { Pong } from "../model/pong";

@Injectable()
export class PingService {
	getPing(): Pong {
		return {
			pong: true,
		};
	}
}
