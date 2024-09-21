import { Injectable, NotFoundException } from "@nestjs/common";
import { readFile } from "fs/promises";
import * as path from "path";
import { User } from "src/types";

@Injectable()
export class DeliveryRepository {
  async getNextDelivery(userId: string): Promise<User> {
    const filePath = path.join(__dirname, "..", "..", "data.json");

    // Read the JSON file asynchronously
    const data = await readFile(filePath, "utf8");
    const users: User[] = JSON.parse(data);

    // Find the user by 'userId'
    const user = users.find((user) => user.id === userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
