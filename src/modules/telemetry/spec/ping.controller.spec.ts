import { Test, TestingModule } from "@nestjs/testing";
import { PingController } from "../controller/ping.controller";
import { PingService } from "../service/ping.service";
import { Pong } from "../model/pong";

describe("PingController", () => {
	let app: TestingModule;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [PingController],
			providers: [PingService],
		}).compile();
	});

	describe("getPing", () => {
		it("should matches the pong", () => {
			const appController = app.get(PingController);
			expect(appController.getPing()).toMatchObject(new Pong(true));
		});
	});
});
