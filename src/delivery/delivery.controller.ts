import { Controller, Get, Param } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { ValidateUUIDPipe } from "./pipes/validate-uuid.pipe";

@Controller("comms")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get("/your-next-delivery/:userId")
  getNextDelivery(@Param("userId", ValidateUUIDPipe) userId: string) {
    return this.deliveryService.getNextDelivery(userId);
  }

  @Get("/all-user-ids")
  getAllUserIds() {
    return this.deliveryService.getAllUserIds();
  }
}
