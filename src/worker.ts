import { MatchingWorker } from './application/use-cases/match-worker';
import dotenv from 'dotenv';

dotenv.config();

async function start() {
  await MatchingWorker.processOrders();
}

start();
