import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import authRoutes from './interfaces/routes/auth.routes';
import healthCheckRoutes from './interfaces/routes/health-check.routes';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/health', healthCheckRoutes);
// Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Socket.io básico (placeholder pra já testar)
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

async function start() {
  await redisClient.connect();
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

start();
