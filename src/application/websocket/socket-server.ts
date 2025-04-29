import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

let io: SocketIOServer;

export function initSocketServer(server: http.Server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(`🛰️ Client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
