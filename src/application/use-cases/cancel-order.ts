import { OrderStatus } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderSocketHandler } from '../../interfaces/websocket-handlers/order-socket-handler';
import { OrderBookService } from '../../domain/services/order-book.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    
    // Emitir evento via socket
    OrderSocketHandler.broadcastOrderCancelled({ orderId });
    
    // Atualizar e transmitir o order book
    try {
      console.log('📊 Atualizando order book após cancelamento de ordem...');
      const orderBookService = new OrderBookService(this.orderRepository);
      const orderBook = await orderBookService.getOrderBook();
      OrderSocketHandler.broadcastOrderBookUpdate(orderBook);
      console.log('✅ Order book atualizado e transmitido com sucesso após cancelamento');
    } catch (error) {
      console.error('❌ Erro ao atualizar e transmitir order book após cancelamento:', error);
    }
    
    // Obter e transmitir o saldo atualizado após cancelar a ordem
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, btcBalance: true, usdBalance: true }
      });
      
      if (user) {
        OrderSocketHandler.broadcastBalanceUpdate({
          userId: user.id,
          balance: {
            btc: user.btcBalance,
            usd: user.usdBalance
          }
        });
      }
    } catch (balanceError) {
      console.error('Erro ao transmitir atualização de saldo após cancelar ordem:', balanceError);
    }
  }
}
