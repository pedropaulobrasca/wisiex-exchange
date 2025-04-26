import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../infrastructure/prisma/client';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
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
      const userId = req.user!.userId;

      const order = await prisma.order.create({
        data: {
          userId,
          type,
          amount,
          price,
          status: 'OPEN',
        },
      });

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  }
}
