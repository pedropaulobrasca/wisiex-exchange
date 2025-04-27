import { getIO } from "../../app/websocket/socket-server";

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
}