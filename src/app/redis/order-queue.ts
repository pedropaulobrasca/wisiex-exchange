import { Order } from "@prisma/client";
import redisClient from "./redis-client";

const ORDER_QUEUE = 'order_queue';

export class OrderQueue {
  static async addOrder(order: Order) {
    await redisClient.rPush(ORDER_QUEUE, JSON.stringify(order));
  }

  static async getNextOrder() {
    const order = await redisClient.lPop(ORDER_QUEUE);
    return order ? JSON.parse(order) : null;
  }

  static async getOrderCount() {
    const count = await redisClient.lLen(ORDER_QUEUE);
    return count;
  }
}