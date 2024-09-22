import { DeliveryRepository } from "./delivery.repository";
import { NotFoundException } from "@nestjs/common";
import { readFile } from "fs/promises";
import { User } from "src/types";

jest.mock("fs/promises");

describe("DeliveryRepository", () => {
  let repository: DeliveryRepository;

  beforeEach(() => {
    repository = new DeliveryRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of user IDs', async () => {
    const mockUsers: User[] = [
      { id: '123', firstName: 'John', lastName: 'Doe', email: 'john@example.com', cats: [] },
      { id: '456', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', cats: [] },
      { id: '789', firstName: 'Jim', lastName: 'Doe', email: 'jim@example.com', cats: [] },
    ];

    (readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUsers));

    const result = await repository.getAllUserIds();

    expect(result).toEqual(['123', '456', '789']);
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  it("should return the correct user when userId exists", async () => {
    const mockUsers: User[] = [
      {
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
          },
        ],
      },
    ];

    // Mock the 'readFile' method to return the mockUsers defined above
    (readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUsers));

    // Call the 'getNextDelivery' method with the userId
    const result = await repository.getNextDelivery(
      "9e3f04bb-d485-4dab-a08b-a6c356f30a03",
    );

    // Ensure that the correct user is returned
    expect(result).toEqual(mockUsers[0]);

    // Ensure readFile was callled
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  it("should throw NotFoundException when userId does not exist", async () => {
    const mockUsers: User[] = [
      {
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
          },
        ],
      },
    ];

    (readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUsers));

    // Ensure it throws a NotFoundException when the userId does not exist
    await expect(repository.getNextDelivery("non-existent-id")).rejects.toThrow(
      NotFoundException,
    );

    expect(readFile).toHaveBeenCalledTimes(1);
  });
});
