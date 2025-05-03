import { Router, Request, Response } from 'express';
import { ensureAuthenticated } from '../middleware/auth.middleware';
import { StatisticsController } from '../controllers/statistics.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    StatisticsController.getStatistics(req, res);
  });
});

export default router; 