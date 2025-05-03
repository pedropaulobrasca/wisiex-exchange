import { StatisticsService } from '../../../src/domain/services/statistics.service';
import { StatisticsRepository } from '../../../src/domain/repositories/statistics.repository';

// Mock do OrderSocketHandler
jest.mock('../../../src/interfaces/websocket-handlers/order-socket-handler', () => ({
  OrderSocketHandler: {
    broadcastStatisticsUpdate: jest.fn(),
  },
}));

import { OrderSocketHandler } from '../../../src/interfaces/websocket-handlers/order-socket-handler';


describe('StatisticsService', () => {
  let statisticsRepositoryMock: jest.Mocked<StatisticsRepository>;

  beforeEach(() => {
    statisticsRepositoryMock = {
      findLastMatch: jest.fn(),
      findMatchesFromLast24Hours: jest.fn(),
      getLastMatch: jest.fn(),
      getMatchesSince: jest.fn(),
    };
  });

  // deve calcular estatísticas e transmitir atualizações
  it('should calculate statistics and broadcast them', async () => {
    // Arrange
    const now = new Date();

    statisticsRepositoryMock.findLastMatch.mockResolvedValue({
      price: 10000,
      volume: 0.8,
      buyerId: '1',
      sellerId: '2',
      createdAt: now,
    });

    statisticsRepositoryMock.findMatchesFromLast24Hours.mockResolvedValue([
      { price: 9900, volume: 0.5, createdAt: now, buyerId: '1', sellerId: '2' },
      { price: 10100, volume: 0.3, createdAt: now, buyerId: '1', sellerId: '2' },
    ]);

    const service = new StatisticsService(statisticsRepositoryMock);

    // Act
    await service.updateStatistics();

    // Assert
    expect(OrderSocketHandler.broadcastStatisticsUpdate).toHaveBeenCalledTimes(1);

    const statsEmitted = (OrderSocketHandler.broadcastStatisticsUpdate as jest.Mock).mock.calls[0][0];

    expect(statsEmitted.lastPrice).toBe(10000);
    expect(statsEmitted.btcVolume).toBeCloseTo(0.8, 5);
    expect(statsEmitted.usdVolume).toBeCloseTo((9900 * 0.5) + (10100 * 0.3), 5);
    expect(statsEmitted.high).toBe(10100);
    expect(statsEmitted.low).toBe(9900);
    expect(statsEmitted.updatedAt).toBeInstanceOf(Date);
  });
});
