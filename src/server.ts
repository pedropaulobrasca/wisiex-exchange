import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import authRoutes from './interfaces/routes/auth.routes';
import healthCheckRoutes from './interfaces/routes/health-check.routes';
import orderRoutes from './interfaces/routes/order.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './application/config/swagger';
import { initSocketServer } from './application/websocket/socket-server';
import matchesRoutes from './interfaces/routes/match.routes';
import { orderBookRoutes } from './interfaces/routes/order-book.routes';
import statisticsRoutes from './interfaces/routes/statistics.routes';
import userRoutes from './interfaces/routes/user.routes';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);
initSocketServer(server);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? [
    'https://wisiex.pedrodev.com.br',
    'https://api.wisiex.pedrodev.com.br'
  ] : '*',
  credentials: true,
}));

app.use(express.json());

// Rotas de saúde e documentação
app.use('/health', healthCheckRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas privadas
app.use('/orders', orderRoutes);
app.use('/matches', matchesRoutes);
app.use('/order-book', orderBookRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/user', userRoutes);

// Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

async function start() {
  await redisClient.connect();
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

start();
