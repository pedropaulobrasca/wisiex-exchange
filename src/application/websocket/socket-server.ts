import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

let io: SocketIOServer | null = null;

export function initSocketServer(server: http.Server) {
  if (io) {
    console.log('Socket.io já inicializado, reutilizando instância.');
    return io;
  }
  
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONT_URL || '*',
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🛰️ Client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
  
  console.log('Socket.io inicializado com sucesso.');
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io não inicializado! Chame initSocketServer primeiro.');
  }
  return io;
}
