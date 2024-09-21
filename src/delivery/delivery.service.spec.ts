import { Test, TestingModule } from "@nestjs/testing";
import { DeliveryService } from "./delivery.service";
import { DeliveryRepository } from "./delivery.repository";
import { User } from "src/types";

describe("DeliveryService", () => {
  let service: DeliveryService;
  let repository: DeliveryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: DeliveryRepository,
          useValue: {
            getNextDelivery: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    repository = module.get<DeliveryRepository>(DeliveryRepository);
  });

  it("should return delivery information for a valid userId", async () => {
    const mockUser: User = {
      id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
      firstName: "John",
      lastName: "Doe",
      email: "JohnDoe@example.com",
      cats: [
        {
          name: "Fluffy",
          subscriptionActive: true,
          pouchSize: "C",
          breed: "Siames",
        },
        {
          name: "Snowball",
          subscriptionActive: true,
          pouchSize: "F",
          breed: "Persian",
        },
      ],
    };

    const mockDeliveryInfo = {
      title: "Your next delivery for Fluffy and Snowball",
      message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Snowball's fresh food.`,
      totalPrice: "134.00",
      freeGift: true,
    };

    jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

    const result = await service.getNextDelivery(mockUser.id);

    expect(result).toEqual(mockDeliveryInfo);
    expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
  });

  describe("No Active Subscriptions", () => {
    it("should return a message indicating no active subscriptions when user has no active cat subscriptions", async () => {
      const mockUser: User = {
        id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        cats: [
          {
            name: "Fluffy",
            subscriptionActive: false,
            pouchSize: "C",
            breed: "Siamese",
          },
          {
            name: "Snowball",
            subscriptionActive: false,
            pouchSize: "F",
            breed: "Persian",
          },
        ],
      };

      const expectedResult = {
        title: "No active subscriptions",
        message: `Hey John! Currently, you have no active subscriptions for your cats.`,
        totalPrice: "0.00",
        freeGift: false,
      };

      jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

      const result = await service.getNextDelivery(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe("Error Handling", () => {
    it("should throw an error if the user is not found", async () => {
      const userId = "non-existent-id";

      jest
        .spyOn(repository, "getNextDelivery")
        .mockRejectedValueOnce(new Error("User not found"));

      await expect(service.getNextDelivery(userId)).rejects.toThrow(
        /^User not found$/,
      );
      expect(repository.getNextDelivery).toHaveBeenCalledWith(userId);
    });
  });

  describe("Free Gift Logic", () => {
    it("should mark freeGift as true when total price exceeds £120", async () => {
      const mockUser: User = {
        id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        cats: [
          {
            name: "Fluffy",
            subscriptionActive: true,
            pouchSize: "F",
            breed: "Siamese",
          }, // £71.25
          {
            name: "Snowball",
            subscriptionActive: true,
            pouchSize: "E",
            breed: "Persian",
          }, // £69.00
        ],
      };

      const expectedResult = {
        title: "Your next delivery for Fluffy and Snowball",
        message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Snowball's fresh food.`,
        totalPrice: "140.25",
        freeGift: true,
      };

      jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

      const result = await service.getNextDelivery(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
    });

    it("should mark freeGift as false when total price is below £120", async () => {
      const mockUser: User = {
        id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        cats: [
          {
            name: "Fluffy",
            subscriptionActive: true,
            pouchSize: "A",
            breed: "Siamese",
          }, // £55.50
          {
            name: "Snowball",
            subscriptionActive: true,
            pouchSize: "B",
            breed: "Persian",
          }, // £59.50
        ],
      };

      const expectedResult = {
        title: "Your next delivery for Fluffy and Snowball",
        message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Snowball's fresh food.`,
        totalPrice: "115.00",
        freeGift: false,
      };

      jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

      const result = await service.getNextDelivery(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe("Cat Name Formatting", () => {
    it("should format the cat name correctly for a single cat", async () => {
      const mockUser: User = {
        id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        cats: [
          {
            name: "Fluffy",
            subscriptionActive: true,
            pouchSize: "C",
            breed: "Siamese",
          }, // £62.75
        ],
      };

      const expectedResult = {
        title: "Your next delivery for Fluffy",
        message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy's fresh food.`,
        totalPrice: "62.75",
        freeGift: false,
      };

      jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

      const result = await service.getNextDelivery(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
    });

    it("should format the cat names correctly for two cats", async () => {
      const mockUser: User = {
        id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        cats: [
          {
            name: "Fluffy",
            subscriptionActive: true,
            pouchSize: "C",
            breed: "Siamese",
          }, // £62.75
          {
            name: "Snowball",
            subscriptionActive: true,
            pouchSize: "F",
            breed: "Persian",
          }, // £71.25
        ],
      };

      const expectedResult = {
        title: "Your next delivery for Fluffy and Snowball",
        message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Snowball's fresh food.`,
        totalPrice: "134.00",
        freeGift: true,
      };

      jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

      const result = await service.getNextDelivery(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
    });

    it("should format the cat names correctly for three or more cats", async () => {
      const mockUser: User = {
        id: "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        cats: [
          {
            name: "Fluffy",
            subscriptionActive: true,
            pouchSize: "C",
            breed: "Siamese",
          }, // £62.75
          {
            name: "Snowball",
            subscriptionActive: true,
            pouchSize: "F",
            breed: "Persian",
          }, // £71.25
          {
            name: "Whiskers",
            subscriptionActive: true,
            pouchSize: "D",
            breed: "Maine Coon",
          }, // £66.00
        ],
      };

      const expectedResult = {
        title: "Your next delivery for Fluffy, Snowball, and Whiskers",
        message: `Hey John! In two days' time, we'll be charging you for your next order for Fluffy, Snowball, and Whiskers's fresh food.`,
        totalPrice: "200.00",
        freeGift: true,
      };

      jest.spyOn(repository, "getNextDelivery").mockResolvedValueOnce(mockUser);

      const result = await service.getNextDelivery(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(repository.getNextDelivery).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
