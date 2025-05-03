import { Request, Response } from 'express';
import { PrismaStatisticsRepository } from '../../infrastructure/prisma/prisma-statistics-repo';
import { GetStatistics } from '../../application/use-cases/get-statistics';

export class StatisticsController {
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statisticsRepository = new PrismaStatisticsRepository();
      const getStatistics = new GetStatistics(statisticsRepository);
      
      const statistics = await getStatistics.execute();
      
      res.json(statistics);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  }
} 