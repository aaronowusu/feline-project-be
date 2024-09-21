import { Test, TestingModule } from "@nestjs/testing";
import { DeliveryController } from "./delivery.controller";
import { DeliveryService } from "./delivery.service";
import { NotFoundException } from "@nestjs/common";

describe("DeliveryController", () => {
  let controller: DeliveryController;
  let service: DeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: DeliveryService,
          useValue: {
            getNextDelivery: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
    service = module.get<DeliveryService>(DeliveryService);
  });

  describe("getNextDelivery", () => {
    it("should call the service with the correct userId", async () => {
      const userId = "9e3f04bb-d485-4dab-a08b-a6c356f30a03";
      const mockResponse = {
        title: "Your next delivery for Fluffy and Snowball",
        message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Snowball's fresh food.`,
        totalPrice: "134.00",
        freeGift: true,
      };

      jest
        .spyOn(service, "getNextDelivery")
        .mockResolvedValueOnce(mockResponse);

      const result = await controller.getNextDelivery(userId);

      expect(service.getNextDelivery).toHaveBeenCalledWith(userId);

      expect(result).toEqual(mockResponse);
    });

    it("should throw NotFoundException if service throws one", async () => {
      const userId = "non-existent-id";

      jest
        .spyOn(service, "getNextDelivery")
        .mockRejectedValueOnce(new NotFoundException("User not found"));

      // Expect the controller to propagate the exception
      await expect(controller.getNextDelivery(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
