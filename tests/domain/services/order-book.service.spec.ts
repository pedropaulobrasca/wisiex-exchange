import { OrderBookService } from '../../../src/domain/services/order-book.service';
import { OrderRepository } from '../../../src/domain/repositories/order.repository';
import { Order } from '../../../src/domain/entities/order.entity';

describe('OrderBookService', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let orderBookService: OrderBookService;

  beforeEach(() => {
    orderRepositoryMock = {
      findOpenOrdersByType: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findActiveOrdersByUserId: jest.fn(),
    };

    orderBookService = new OrderBookService(orderRepositoryMock);
  });

  // deve agrupar e ordenar ordens de compra e venda corretamente
  it('should group and order buy and sell orders correctly', async () => {
    // Arrange
    const mockBuyOrders = [
      new Order({
        id: '1',
        userId: 'user1',
        type: 'BUY',
        amount: 0.5,
        price: 10000,
        status: 'OPEN',
      }),
      new Order({
        id: '2',
        userId: 'user2',
        type: 'BUY',
        amount: 0.3,
        price: 10000, // mesmo preço que a primeira ordem
        status: 'OPEN',
      }),
      new Order({
        id: '3',
        userId: 'user3',
        type: 'BUY',
        amount: 0.2,
        price: 10500, // preço maior
        status: 'OPEN',
      }),
    ];
    
    const mockSellOrders = [
      new Order({
        id: '4',
        userId: 'user4',
        type: 'SELL',
        amount: 0.4,
        price: 10800,
        status: 'OPEN',
      }),
      new Order({
        id: '5',
        userId: 'user5',
        type: 'SELL',
        amount: 0.7,
        price: 10800, // mesmo preço que a primeira ordem
        status: 'OPEN',
      }),
      new Order({
        id: '6',
        userId: 'user6',
        type: 'SELL',
        amount: 0.1,
        price: 10600, // preço menor
        status: 'OPEN',
      }),
    ];

    orderRepositoryMock.findOpenOrdersByType.mockImplementation((type) => {
      if (type === 'BUY') return Promise.resolve(mockBuyOrders);
      if (type === 'SELL') return Promise.resolve(mockSellOrders);
      return Promise.resolve([]);
    });

    // Act
    const result = await orderBookService.getOrderBook();

    // Assert
    // Verifica se o método do repositório foi chamado corretamente
    expect(orderRepositoryMock.findOpenOrdersByType).toHaveBeenCalledWith('BUY');
    expect(orderRepositoryMock.findOpenOrdersByType).toHaveBeenCalledWith('SELL');
    
    // Verifica se os bids (compras) estão ordenados do maior para o menor preço
    expect(result.bids.length).toBe(2); // Dois preços diferentes
    expect(result.bids[0].price).toBe(10500);
    expect(result.bids[0].volume).toBe(0.2);
    expect(result.bids[1].price).toBe(10000);
    expect(result.bids[1].volume).toBe(0.8); // 0.5 + 0.3
    
    // Verifica se os asks (vendas) estão ordenados do menor para o maior preço
    expect(result.asks.length).toBe(2); // Dois preços diferentes
    expect(result.asks[0].price).toBe(10600);
    expect(result.asks[0].volume).toBe(0.1);
    expect(result.asks[1].price).toBe(10800);
    expect(result.asks[1].volume).toBe(1.1); // 0.4 + 0.7
  });

  // deve retornar order book vazio quando não houver ordens
  it('should return empty order book when there are no orders', async () => {
    // Arrange
    orderRepositoryMock.findOpenOrdersByType.mockResolvedValue([]);

    // Act
    const result = await orderBookService.getOrderBook();

    // Assert
    expect(result.bids).toEqual([]);
    expect(result.asks).toEqual([]);
  });

  // deve arredondar volumes para 8 casas decimais
  it('should round volumes to 8 decimal places', async () => {
    // Arrange
    const mockBuyOrders = [
      new Order({
        id: '1',
        userId: 'user1',
        type: 'BUY',
        amount: 0.123456789, // mais de 8 casas decimais
        price: 10000,
        status: 'OPEN',
      }),
    ];
    
    orderRepositoryMock.findOpenOrdersByType.mockImplementation((type) => {
      if (type === 'BUY') return Promise.resolve(mockBuyOrders);
      return Promise.resolve([]);
    });

    // Act
    const result = await orderBookService.getOrderBook();

    // Assert
    expect(result.bids[0].volume).toBe(0.12345679); // arredondado para 8 casas
  });
});
