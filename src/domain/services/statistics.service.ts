import { OrderSocketHandler } from '../../interfaces/websocket-handlers/order-socket-handler';
import { StatisticsRepository } from '../repositories/statistics.repository';

export class StatisticsService {
  constructor(private statisticsRepository: StatisticsRepository) {}

  async updateStatistics() {
    const now = new Date();

    const lastMatch = await this.statisticsRepository.findLastMatch();
    const matches24h = await this.statisticsRepository.findMatchesFromLast24Hours();

    const btcVolume = matches24h.reduce((sum, match) => sum + match.volume, 0);
    const usdVolume = matches24h.reduce((sum, match) => sum + match.price * match.volume, 0);

    const prices = matches24h.map(m => m.price);
    const high = prices.length > 0 ? Math.max(...prices) : null;
    const low = prices.length > 0 ? Math.min(...prices) : null;

    const stats = {
      lastPrice: lastMatch ? lastMatch.price : null,
      btcVolume,
      usdVolume,
      high,
      low,
      updatedAt: now,
    };

    OrderSocketHandler.broadcastStatisticsUpdate(stats);
  }
}
