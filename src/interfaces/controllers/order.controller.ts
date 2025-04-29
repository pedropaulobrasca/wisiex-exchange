import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { OrderQueue } from '../../application/redis/order-queue';
import { OrderSocketHandler } from '../websocket-handlers/order-socket-handler';
import { PrismaOrderRepository } from '../../infrastructure/prisma/prisma-order-repo';
import { Order } from '../../domain/entities/order.entity';
import { CancelOrder } from '../../application/use-cases/cancel-order';

export class OrderController {
  static async createOrder(req: AuthenticatedRequest, res: Response) {
    const schema = z.object({
      type: z.enum(['BUY', 'SELL']),
      amount: z.number().positive(),
      price: z.number().positive(),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: 'Invalid request', errors: result.error.errors });
    }

    const { type, amount, price } = result.data;
    
    try {
      const userId = req.user!.id;

      const orderRepository = new PrismaOrderRepository();

      const orderEntity = new Order({
        userId: userId,
        type,
        amount,
        price,
        status: 'OPEN',
      });

      const order = await orderRepository.create(orderEntity);

      await OrderQueue.addOrder({
        id: order.id as string,
        userId: order.userId,
        type: order.type,
        amount: order.amount,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      });
      
      OrderSocketHandler.broadcastNewOrder(order);

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  }

  static async cancelOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const schema = z.object({
      orderId: z.string(),
    });

    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({ message: 'Invalid request', errors: result.error.errors });
    }

    const { orderId } = result.data;
    
    const orderRepository = new PrismaOrderRepository();
    const cancelOrder = new CancelOrder(orderRepository);

    try {
      await cancelOrder.execute(orderId, userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getActiveOrders(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const orderRepository = new PrismaOrderRepository();
    const activeOrders = await orderRepository.findActiveOrdersByUserId(userId);
    res.status(200).json(activeOrders);
  }
}
