import { Request, Response } from 'express';
import { Match } from '../../domain/entities/match.entity';
import prisma from '../../application/database/prisma-client';

export class StatisticsController {
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      // Obtém a última negociação para o último preço
      const lastMatch = await prisma.match.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Obtém as negociações das últimas 24 horas
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const recentMatches = await prisma.match.findMany({
        where: {
          createdAt: {
            gte: oneDayAgo
          }
        }
      });

      // Calcula volume em BTC e USD
      let btcVolume = 0;
      let usdVolume = 0;
      let highPrice = lastMatch?.price || 0;
      let lowPrice = lastMatch?.price || 0;

      recentMatches.forEach((match: any) => {
        btcVolume += match.amount;
        usdVolume += match.amount * match.price;
        
        if (match.price > highPrice) highPrice = match.price;
        if (match.price < lowPrice || lowPrice === 0) lowPrice = match.price;
      });

      res.json({
        lastPrice: lastMatch?.price || 0,
        btcVolume,
        usdVolume,
        high: highPrice,
        low: lowPrice
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  }
} 