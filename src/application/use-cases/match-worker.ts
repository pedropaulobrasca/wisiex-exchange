import { OrderMatchingService } from '../../domain/services/order-matching.service';
import { Order, OrderType } from '../../domain/entities/order.entity';
import { OrderQueue } from '../../application/redis/order-queue';
import prisma from '../../application/database/prisma-client';
import { OrderSocketHandler } from '../../interfaces/websocket-handlers/order-socket-handler';
import { StatisticsService } from '../../domain/services/statistics.service';
import { PrismaStatisticsRepository } from '../../infrastructure/prisma/prisma-statistics-repo';
import { OrderBookService } from '../../domain/services/order-book.service';
import { PrismaOrderRepository } from '../../infrastructure/prisma/prisma-order-repo';

export class MatchingWorker {
  private statisticsService: StatisticsService;
  private orderBookService: OrderBookService;

  constructor() {
    const statisticsRepository = new PrismaStatisticsRepository();
    this.statisticsService = new StatisticsService(statisticsRepository);
    
    const orderRepository = new PrismaOrderRepository();
    this.orderBookService = new OrderBookService(orderRepository);
  }

  async processOrders() {
    console.log('🛠️ MatchingWorker started...');

    while (true) {
      const orderData = await OrderQueue.getNextOrder();

      if (!orderData) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Reduzido de 500ms para 100ms
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

      // Salvar matches e atualizar saldos dos usuários
      for (const match of matches) {
        // Criar o match
        const createdMatch = await prisma.match.create({
          data: {
            buyerId: match.buyerId,
            sellerId: match.sellerId,
            price: match.price,
            volume: match.volume,
          },
        });
        
        // Atualizar saldo dos usuários envolvidos no match
        await this.updateUserBalances(match.buyerId, match.sellerId, match.price, match.volume);
        
        // Emitir evento de novo match via WebSocket
        OrderSocketHandler.broadcastNewMatch(createdMatch);
      }

      // Atualizar estatísticas
      await this.statisticsService.updateStatistics();
      
      // Atualizar e transmitir o order book em tempo real
      await this.updateAndBroadcastOrderBook();

      console.log(`✅ Order ${orderData.id} processed: ${matches.length} matches created.`);
    }
  }

  // Método para atualizar e transmitir o order book em tempo real
  private async updateAndBroadcastOrderBook() {
    try {
      console.log('📊 Atualizando order book...');
      const orderBook = await this.orderBookService.getOrderBook();
      OrderSocketHandler.broadcastOrderBookUpdate(orderBook);
      console.log('✅ Order book atualizado e transmitido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar e transmitir order book:', error);
    }
  }

  // Método para atualizar o saldo dos usuários após um match
  private async updateUserBalances(buyerId: string, sellerId: string, price: number, volume: number) {
    try {
      console.log(`💰 Atualizando saldos - Comprador: ${buyerId}, Vendedor: ${sellerId}, Preço: ${price}, Volume: ${volume}`);
      
      // Cálculo do valor total da transação
      const totalValue = price * volume;
      
      // Atualizar saldo do comprador (- USD, + BTC)
      await prisma.user.update({
        where: { id: buyerId },
        data: {
          usdBalance: { decrement: totalValue },
          btcBalance: { increment: volume }
        }
      });
      
      // Atualizar saldo do vendedor (+ USD, - BTC)
      await prisma.user.update({
        where: { id: sellerId },
        data: {
          usdBalance: { increment: totalValue },
          btcBalance: { decrement: volume }
        }
      });
      
      console.log(`✅ Saldos atualizados com sucesso para o match (${buyerId} <-> ${sellerId})`);
      
      // Obter e emitir os novos saldos
      const [buyer, seller] = await Promise.all([
        prisma.user.findUnique({
          where: { id: buyerId },
          select: { id: true, btcBalance: true, usdBalance: true }
        }),
        prisma.user.findUnique({
          where: { id: sellerId },
          select: { id: true, btcBalance: true, usdBalance: true }
        })
      ]);
      
      // Emitir evento de atualização de saldo via WebSocket
      if (buyer) {
        OrderSocketHandler.broadcastBalanceUpdate({
          userId: buyer.id,
          balance: {
            btc: buyer.btcBalance,
            usd: buyer.usdBalance
          }
        });
      }
      
      if (seller) {
        OrderSocketHandler.broadcastBalanceUpdate({
          userId: seller.id,
          balance: {
            btc: seller.btcBalance,
            usd: seller.usdBalance
          }
        });
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar saldos após match:', error);
    }
  }
}
