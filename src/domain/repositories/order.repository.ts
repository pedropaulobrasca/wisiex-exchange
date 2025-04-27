import { Order, OrderType } from "../entities/order.entity";

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  findOpenOrdersByType(type: OrderType): Promise<Order[]>;
}