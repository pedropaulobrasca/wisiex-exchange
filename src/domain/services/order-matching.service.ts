import { Match } from "../entities/match.entity";
import { Order } from "../entities/order.entity";

interface MatchingResult {
  matches: Match[];
  updatedOrders: Order[];
  remainingOrder?: Order;
}

export class OrderMatchingService {
  static matchOrder(newOrder: Order, openOrders: Order[]): MatchingResult {
    const matches: Match[] = [];
    const updatedOrders: Order[] = [];
    let remainingAmount = newOrder.amount;

    // Filtrar ordens opostas (se estou comprando, procuro quem está vendendo, e vice-versa)
    const oppositeOrders = openOrders
      .filter(order => 
        order.type !== newOrder.type && order.status === 'OPEN' &&
        (newOrder.type === 'BUY' ? order.price <= newOrder.price : order.price >= newOrder.price)
      )
      .sort((a, b) => 
        newOrder.type === 'BUY' ? a.price - b.price : b.price - a.price
      ); // Melhor preço primeiro

    for (const order of oppositeOrders) {
      if (remainingAmount <= 0) break;

      const matchedVolume = Math.min(remainingAmount, order.amount);

      // Calcula fees
      const makerFee = matchedVolume * 0.005; // 0.5%
      const takerFee = matchedVolume * 0.003; // 0.3%
      const finalVolume = matchedVolume - makerFee - takerFee;

      matches.push(
        new Match({
          buyerId: newOrder.type === 'BUY' ? newOrder.userId : order.userId,
          sellerId: newOrder.type === 'SELL' ? newOrder.userId : order.userId,
          price: order.price,
          volume: finalVolume,
        })
      );

      // Atualiza a ordem existente
      order.updateAmount(order.amount - matchedVolume);
      if (order.amount <= 0) {
        order.updateStatus('FILLED');
      } else {
        order.updateStatus('PARTIALLY_FILLED');
      }

      updatedOrders.push(order);

      // Atualiza a nova ordem
      remainingAmount -= matchedVolume;
    }

    let remainingOrder: Order | undefined = undefined;

    if (remainingAmount > 0) {
      newOrder.updateAmount(remainingAmount);
      newOrder.updateStatus('OPEN');
      remainingOrder = newOrder;
    } else {
      newOrder.updateStatus('FILLED');
    }

    updatedOrders.push(newOrder);

    return {
      matches,
      updatedOrders,
      remainingOrder,
    };
  }
}
