import { Injectable, NotFoundException } from "@nestjs/common";
import { readFile } from "fs/promises";
import * as path from "path";
import { User } from "src/types";

@Injectable()
export class DeliveryRepository {
  private async readUsersFromFile(): Promise<User[]> {
    const filePath = path.join(__dirname, "..", "..", "data.json");
    const data = await readFile(filePath, "utf8");
    const users: User[] = JSON.parse(data);

    if (!users.length) {
      throw new NotFoundException("No users found");
    }

    return users;
  }

  async getNextDelivery(userId: string): Promise<User> {
    const users = await this.readUsersFromFile();

    const user = users.find((user) => user.id === userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async getAllUserIds(): Promise<string[]> {
    const users = await this.readUsersFromFile();
    return users.map(user => user.id);
  }
}
