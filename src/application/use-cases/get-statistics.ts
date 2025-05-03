import { Match } from '../../domain/entities/match.entity';
import { StatisticsRepository } from '../../domain/repositories/statistics.repository';

export interface Statistics {
  lastPrice: number;
  btcVolume: number;
  usdVolume: number;
  high: number;
  low: number;
}

export class GetStatistics {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute(): Promise<Statistics> {
    // Obtém a última negociação para o último preço
    const lastMatch = await this.statisticsRepository.getLastMatch();
    
    // Obtém as negociações das últimas 24 horas
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentMatches = await this.statisticsRepository.getMatchesSince(oneDayAgo);

    // Calcula volume em BTC e USD
    let btcVolume = 0;
    let usdVolume = 0;
    let highPrice = lastMatch?.price || 0;
    let lowPrice = lastMatch?.price || 0;

    recentMatches.forEach((match: Match) => {
      btcVolume += match.volume;
      usdVolume += match.volume * match.price;
      
      if (match.price > highPrice) highPrice = match.price;
      if (match.price < lowPrice || lowPrice === 0) lowPrice = match.price;
    });

    return {
      lastPrice: lastMatch?.price || 0,
      btcVolume,
      usdVolume,
      high: highPrice,
      low: lowPrice
    };
  }
} 