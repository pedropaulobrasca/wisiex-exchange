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
  
  // Configurações completas de CORS
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  
  app.use(cors(corsOptions));
  
  // Preflight CORS
  app.options('*', cors(corsOptions));
  
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
