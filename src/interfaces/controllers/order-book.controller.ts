import { Request, Response } from 'express';
import { PrismaOrderRepository } from '../../infrastructure/prisma/prisma-order-repo';
import { OrderBookService } from '../../domain/services/order-book.service';

export class OrderBookController {
  static async list(req: Request, res: Response) {
    const orderRepository = new PrismaOrderRepository();
    const orderBookService = new OrderBookService(orderRepository);

    const orderBook = await orderBookService.getOrderBook();
    return res.json(orderBook);
  }
}
