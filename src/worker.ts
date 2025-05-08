import { MatchingWorker } from './application/use-cases/match-worker';
import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { initSocketServer } from './application/websocket/socket-server';

dotenv.config();

async function start() {
  console.log('🛠️ Iniciando worker...');
  
  // Criar um servidor HTTP para inicializar o Socket.IO
  const app = express();
  
  // CORS via pacote
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
  }));
  
  // Middleware para responder requisições OPTIONS explicitamente
  app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
  });
  
  const server = http.createServer(app);
  
  // Inicializar o socket server
  initSocketServer(server);
  
  // Iniciar o servidor em uma porta diferente do servidor principal
  const workerPort = process.env.WORKER_PORT || 3334;
  server.listen(workerPort, () => {
    console.log(`📡 Worker Socket Server iniciado na porta ${workerPort}`);
  });
  
  // Iniciar o worker de processamento
  const matchingWorker = new MatchingWorker();
  await matchingWorker.processOrders();
}

start();
