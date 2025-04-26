import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import authRoutes from './interfaces/routes/auth.routes';
import healthCheckRoutes from './interfaces/routes/health-check.routes';
import orderRoutes from './interfaces/routes/order.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './app/config/swagger';

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

// Rotas de saúde e documentação
app.use('/health', healthCheckRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas privadas
app.use('/orders', orderRoutes);

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
