import { OrderRepository } from '../repositories/order.repository';

export class OrderBookService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getOrderBook() {
    const buyOrders = await this.orderRepository.findOpenOrdersByType('BUY');
    const sellOrders = await this.orderRepository.findOpenOrdersByType('SELL');

    const groupOrders = (orders: typeof buyOrders) => {
      const map = new Map<number, number>();

      for (const order of orders) {
        const current = map.get(order.price) || 0;
        map.set(order.price, current + order.amount);
      }

      const result = Array.from(map.entries()).map(([price, volume]) => ({
        price,
        volume: parseFloat(volume.toFixed(8)),
      }));

      return result;
    };

    const bids = groupOrders(buyOrders).sort((a, b) => b.price - a.price); // Maior primeiro
    const asks = groupOrders(sellOrders).sort((a, b) => a.price - b.price); // Menor primeiro

    return { bids, asks };
  }
}
