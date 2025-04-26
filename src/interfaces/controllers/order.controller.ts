import { Response } from 'express';
import { z } from 'zod';
import prisma from '../../app/database/prisma-client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { OrderQueue } from '../../app/redis/order-queue';
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

      const order = await prisma.order.create({
        data: {
          userId,
          type,
          amount,
          price,
          status: 'OPEN',
        },
      });

      await OrderQueue.addOrder(order);

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  }
}
