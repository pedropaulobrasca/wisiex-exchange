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
}