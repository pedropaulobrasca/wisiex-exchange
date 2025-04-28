import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import prisma from '../../app/database/prisma-client';

export class PrismaUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      username: user.username,
      usdBalance: user.usdBalance,
      btcBalance: user.btcBalance,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        usdBalance: user.usdBalance,
        btcBalance: user.btcBalance,
      },
    });

    return new User({
      id: createdUser.id,
      username: createdUser.username,
      usdBalance: createdUser.usdBalance,
      btcBalance: createdUser.btcBalance,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      username: user.username,
      usdBalance: user.usdBalance,
      btcBalance: user.btcBalance,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
