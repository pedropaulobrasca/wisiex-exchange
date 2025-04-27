import { OrderMatchingService } from '../../domain/services/order-matching.service';
import { Order, OrderType } from '../../domain/entities/order.entity';
import { OrderQueue } from '../../app/redis/order-queue';
import prisma from '../../app/database/prisma-client';
import { OrderSocketHandler } from '../../interfaces/websocket-handlers/order-socket-handler';
export class MatchingWorker {
  static async processOrders() {
    console.log('🛠️ MatchingWorker started...');

    while (true) {
      const orderData = await OrderQueue.getNextOrder();

      if (!orderData) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Evita busy-wait
        continue;
      }

      console.log(`📦 Processing order ID ${orderData.id}...`);

      const newOrder = new Order({
        id: orderData.id,
        userId: orderData.userId,
        type: orderData.type,
        amount: orderData.amount,
        price: orderData.price,
        status: 'OPEN',
      });

      // Buscar ordens abertas do tipo oposto
      const openOrdersDb = await prisma.order.findMany({
        where: {
          status: 'OPEN',
          type: newOrder.type === 'BUY' ? 'SELL' : 'BUY',
        },
        orderBy: {
          price: newOrder.type === 'BUY' ? 'asc' : 'desc',
        },
      });

      const openOrders = openOrdersDb.map(order => new Order({
        id: order.id,
        userId: order.userId,
        type: order.type as OrderType,
        amount: order.amount,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));

      const { matches, updatedOrders, remainingOrder } = OrderMatchingService.matchOrder(newOrder, openOrders);

      // Atualizar ordens no banco
      for (const updated of updatedOrders) {
        await prisma.order.update({
          where: { id: updated.id },
          data: {
            amount: updated.amount,
            status: updated.status,
            updatedAt: updated.updatedAt,
          },
        });

        // Emitir atualização de ordem
        OrderSocketHandler.broadcastNewOrder({
          id: updated.id,
          userId: updated.userId,
          type: updated.type,
          amount: updated.amount,
          price: updated.price,
          status: updated.status,
        });
      }

      // Salvar matches
      for (const match of matches) {
        const createdMatch = await prisma.match.create({
          data: {
            buyerId: match.buyerId,
            sellerId: match.sellerId,
            price: match.price,
            volume: match.volume,
          },
        });
        
        // Emitir evento de novo match via WebSocket
        OrderSocketHandler.broadcastNewMatch(createdMatch);
      }

      console.log(`✅ Order ${orderData.id} processed: ${matches.length} matches created.`);
    }
  }
}
