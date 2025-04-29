import { MatchingWorker } from './application/use-cases/match-worker';
import dotenv from 'dotenv';

dotenv.config();

async function start() {
  const matchingWorker = new MatchingWorker();
  await matchingWorker.processOrders();
}

start();
