import { OrderStatus } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';

export class CancelOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string, userId: string): Promise<void> {
    // Buscar a ordem
    const orders = await this.orderRepository.findOpenOrdersByType('BUY');
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      throw new Error('Order not found or not open');
    }

    if (order.userId !== userId) {
      throw new Error('You can only cancel your own orders');
    }

    if (order.status !== 'OPEN') {
      throw new Error('Only open orders can be canceled');
    }

    // Atualizar para cancelada
    order.updateStatus('CANCELED');

    await this.orderRepository.update(order);
  }
}
