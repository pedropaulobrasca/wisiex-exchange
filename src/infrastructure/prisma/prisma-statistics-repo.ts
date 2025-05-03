import prisma from "../../application/database/prisma-client";
import { Match } from "../../domain/entities/match.entity";
import { StatisticsRepository } from "../../domain/repositories/statistics.repository";

export class PrismaStatisticsRepository implements StatisticsRepository {
  async findLastMatch(): Promise<Match | null> {
    return prisma.match.findFirst({ orderBy: { createdAt: 'desc' } });
  }

  async findMatchesFromLast24Hours(): Promise<Match[]> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return prisma.match.findMany({
      where: { createdAt: { gte: twentyFourHoursAgo } },
    });
  }

  async getLastMatch(): Promise<Match | null> {
    const match = await prisma.match.findFirst({ 
      orderBy: { createdAt: 'desc' } 
    });

    if (!match) return null;

    return new Match({
      id: match.id,
      buyerId: match.buyerId,
      sellerId: match.sellerId,
      price: match.price,
      volume: match.volume,
      createdAt: match.createdAt
    });
  }

  async getMatchesSince(date: Date): Promise<Match[]> {
    const matches = await prisma.match.findMany({
      where: { createdAt: { gte: date } },
    });

    return matches.map(match => new Match({
      id: match.id,
      buyerId: match.buyerId,
      sellerId: match.sellerId,
      price: match.price,
      volume: match.volume,
      createdAt: match.createdAt
    }));
  }
}