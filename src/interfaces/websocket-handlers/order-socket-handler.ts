import { getIO } from "../../application/websocket/socket-server";

export class OrderSocketHandler {
  static broadcastNewOrder(order: any) {
    const io = getIO();
    io.emit('newOrder', order);
  }

  static broadcastNewMatch(match: any) {
    const io = getIO();
    io.emit('newMatch', match);
  }

  static broadcastStatisticsUpdate(stats: any) {
    const io = getIO();
    io.emit('updateStatistics', stats);
  }

  static broadcastOrderCancelled(data: { orderId: string }) {
    const io = getIO();
    io.emit('orderCancelled', data);
  }

  static broadcastBalanceUpdate(data: { 
    userId: string, 
    balance: { 
      btc: number, 
      usd: number 
    } 
  }) {
    const io = getIO();
    
    // Emite para todos (menos eficiente, mas mais simples)
    io.emit('balanceUpdate', data);
    
    // Alternativa: emitir apenas para usuários específicos (mais eficiente)
    // Requer implementação de salas/rooms no socket
    // io.to(data.userId).emit('balanceUpdate', data.balance);
  }
}