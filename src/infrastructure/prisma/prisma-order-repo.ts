import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderType, OrderStatus } from '../../domain/entities/order.entity';
import prisma from '../../application/database/prisma-client';

export class PrismaOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Order> {
    const created = await prisma.order.create({
      data: {
        userId: order.userId,
        type: order.type,
        amount: order.amount,
        price: order.price,
        status: order.status,
      },
    });

    return new Order({
      id: created.id,
      userId: created.userId,
      type: created.type as OrderType,
      amount: created.amount,
      price: created.price,
      status: created.status as OrderStatus,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(order: Order): Promise<Order> {
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        amount: order.amount,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });

    return new Order({
      id: updated.id,
      userId: updated.userId,
      type: updated.type as OrderType,
      amount: updated.amount,
      price: updated.price,
      status: updated.status as OrderStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async findOpenOrdersByType(type: OrderType): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        type,
        status: 'OPEN',
      },
      orderBy: {
        price: type === 'BUY' ? 'asc' : 'desc',
      },
    });

    return orders.map(order => new Order({
      id: order.id,
      userId: order.userId,
      type: order.type as OrderType,
      amount: order.amount,
      price: order.price,
      status: order.status as OrderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }
}
