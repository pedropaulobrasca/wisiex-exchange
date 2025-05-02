import prisma from '../../application/database/prisma-client';
import { MatchRepository } from '../../domain/repositories/match.repository';
import { Match } from '../../domain/entities/match.entity';

export class PrismaMatchRepository implements MatchRepository {
  async findAll(): Promise<Match[]> {
    const matches = await prisma.match.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return matches.map(match => new Match({
      id: match.id,
      buyerId: match.buyerId,
      sellerId: match.sellerId,
      price: match.price,
      volume: match.volume,
      createdAt: match.createdAt,
    }));
  }

  async findByUserId(userId: string): Promise<Match[]> {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return matches.map(match => new Match({
      id: match.id,
      buyerId: match.buyerId,
      sellerId: match.sellerId,
      price: match.price,
      volume: match.volume,
      createdAt: match.createdAt,
    }));
  }
  
}
