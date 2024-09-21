import { Injectable } from "@nestjs/common";
import { DeliveryRepository } from "./delivery.repository";
import { formatCatNames } from "src/util";
import { pouchPrices } from "src/constants";

@Injectable()
export class DeliveryService {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async getNextDelivery(userId: string) {
    // Retrieve the user from the repository
    const user = await this.deliveryRepository.getNextDelivery(userId);

    // Filter the cats to only include active subscriptions
    const activeCats = user.cats.filter((cat) => cat.subscriptionActive);

    // Format the cat names
    const catNames = activeCats.map((cat) => cat.name);
    const formattedCatNames = formatCatNames(catNames);

    // Calculate the total price
    const totalPrice = activeCats.reduce(
      (total, cat) => total + pouchPrices[cat.pouchSize],
      0,
    );

    const freeGift = totalPrice > 120;

    //Handle the case where there are no active subscriptions
    if (activeCats.length === 0) {
      return {
        title: `No active subscriptions`,
        message: `Hey ${user.firstName}! Currently, you have no active subscriptions for your cats.`,
        totalPrice: "0.00",
        freeGift: false,
      };
    }
    // Return the delivery information
    return {
      title: `Your next delivery for ${formattedCatNames}`,
      message: `Hey ${user.firstName}! In two days' time, we'll be charging you for your next order for ${formattedCatNames}'s fresh food.`,
      totalPrice: totalPrice.toFixed(2),
      freeGift,
    };
  }
}
