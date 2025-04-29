import { Order } from "../../../src/domain/entities/order.entity"
import { OrderMatchingService } from "../../../src/domain/services/order-matching.service";

describe("Order Matching Service", () => {
  // deve combinar corretamente uma ordem de COMPRA com ordens de VENDA
  it("should correctly match a BUY order with SELL orders", () => {
    // Arrange
    const openOrders = [
      new Order({
        id: '1',
        userId: '1',
        type: 'SELL',
        amount: 0.5,
        price: 9900,
        status: 'OPEN',
      }),
      new Order({
        id: '2',
        userId: '1',
        type: 'SELL',
        amount: 0.3,
        price: 10000,
        status: 'OPEN',
      }),
    ];

    const newOrder = new Order({
      userId: '2',
      type: 'BUY',
      amount: 0.7,
      price: 10000,
    });

    // Act
    const { matches, updatedOrders, remainingOrder } = OrderMatchingService.matchOrder(newOrder, openOrders);

    // Assert
    expect(matches.length).toBe(2);

    expect(matches[0].price).toBe(9900);
    expect(matches[0].volume).toBeCloseTo((0.5 * (1 - 0.005 - 0.003)), 5); // Volume - fees

    expect(matches[1].price).toBe(10000);
    expect(matches[1].volume).toBeCloseTo((0.2 * (1 - 0.005 - 0.003)), 5);

    expect(updatedOrders.length).toBe(3);

    const updatedSell1 = updatedOrders.find(o => o.id === '1');
    const updatedSell2 = updatedOrders.find(o => o.id === '2');
    const updatedBuy = updatedOrders.find(o => o.id === undefined); // Buy ainda não foi salva

    expect(updatedSell1?.status).toBe('FILLED');
    expect(updatedSell2?.status).toBe('PARTIALLY_FILLED');
    expect(updatedSell2?.amount).toBeCloseTo(0.1, 5);

    expect(updatedBuy?.status).toBe('FILLED');
    expect(remainingOrder).toBeUndefined();
  })

  // deve não combinar se não houver ordens opostas
  it('should not match if there are no opposite orders', () => {
    const openOrders = [
      new Order({
        id: '1',
        userId: '1',
        type: 'BUY', // mesma direção
        amount: 1,
        price: 10000,
        status: 'OPEN',
      }),
    ];
  
    const newOrder = new Order({
      userId: '2',
      type: 'BUY', // mesma direção
      amount: 1,
      price: 10000,
    });
  
    const { matches, updatedOrders, remainingOrder } = OrderMatchingService.matchOrder(newOrder, openOrders);
  
    expect(matches.length).toBe(0);
    expect(updatedOrders.length).toBe(1);
    expect(remainingOrder).toBeDefined();
  });

  // deve parcialmente preencher a nova ordem se não houver ordens opostas suficientes
  it('should partially fill the new order if there are not enough matching orders', () => {
    const openOrders = [
      new Order({
        id: '1',
        userId: '1',
        type: 'SELL',
        amount: 0.3,
        price: 10000,
        status: 'OPEN',
      }),
    ];
  
    const newOrder = new Order({
      userId: '2',
      type: 'BUY',
      amount: 0.5,
      price: 10000,
    });
  
    const { matches, updatedOrders, remainingOrder } = OrderMatchingService.matchOrder(newOrder, openOrders);
  
    expect(matches.length).toBe(1);
  
    const updatedSell = updatedOrders.find(o => o.id === '1');
    expect(updatedSell?.status).toBe('FILLED');
    
    const updatedBuy = updatedOrders.find(o => o.id === undefined);
    expect(updatedBuy?.status).toBe('OPEN'); // Ainda aberto
  
    expect(remainingOrder).toBeDefined();
    expect(remainingOrder?.amount).toBeCloseTo(0.2, 5);
  });
  
  // deve combinar corretamente uma ordem de VENDA com ordens de COMPRA
  it('should correctly match a SELL order with BUY orders', () => {
    const openOrders = [
      new Order({
        id: '1',
        userId: '1',
        type: 'BUY',
        amount: 0.4,
        price: 10000,
        status: 'OPEN',
      }),
      new Order({
        id: '2',
        userId: '1',
        type: 'BUY',
        amount: 0.2,
        price: 9900,
        status: 'OPEN',
      }),
    ];
  
    const newOrder = new Order({
      userId: '2',
      type: 'SELL',
      amount: 0.5,
      price: 9800,
    });
  
    const { matches, updatedOrders, remainingOrder } = OrderMatchingService.matchOrder(newOrder, openOrders);
  
    expect(matches.length).toBe(2);
  
    const updatedBuy1 = updatedOrders.find(o => o.id === '1');
    const updatedBuy2 = updatedOrders.find(o => o.id === '2');
    expect(updatedBuy1?.status).toBe('FILLED');
    expect(updatedBuy2?.status).toBe('PARTIALLY_FILLED');
  
    const updatedSell = updatedOrders.find(o => o.id === undefined);
    expect(updatedSell?.status).toBe('FILLED');
  
    expect(remainingOrder).toBeUndefined();
  });

  // deve combinar corretamente uma ordem de VENDA com ordens de COMPRA
  it('should correctly match a SELL order against BUY orders', () => {
    const openOrders = [
      new Order({
        id: '1',
        userId: '1',
        type: 'BUY',
        amount: 0.4,
        price: 10000,
        status: 'OPEN',
      }),
      new Order({
        id: '2',
        userId: '1',
        type: 'BUY',
        amount: 0.2,
        price: 9900,
        status: 'OPEN',
      }),
    ];
  
    const newOrder = new Order({
      userId: '2',
      type: 'SELL',
      amount: 0.5,
      price: 9800,
    });
  
    const { matches, updatedOrders, remainingOrder } = OrderMatchingService.matchOrder(newOrder, openOrders);
  
    expect(matches.length).toBe(2);
  
    const updatedBuy1 = updatedOrders.find(o => o.id === '1');
    const updatedBuy2 = updatedOrders.find(o => o.id === '2');
    expect(updatedBuy1?.status).toBe('FILLED');
    expect(updatedBuy2?.status).toBe('PARTIALLY_FILLED');
  
    const updatedSell = updatedOrders.find(o => o.id === undefined);
    expect(updatedSell?.status).toBe('FILLED');
  
    expect(remainingOrder).toBeUndefined();
  });
})