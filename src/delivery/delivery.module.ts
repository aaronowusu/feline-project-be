import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { DeliveryService } from "./delivery.service";
import { DeliveryRepository } from "./delivery.repository";

@Module({
  imports: [],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryRepository],
})
export class DeliveryModule {}
