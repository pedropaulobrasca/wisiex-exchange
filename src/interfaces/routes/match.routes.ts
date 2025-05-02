import { Router, Request, Response } from 'express';
import { ensureAuthenticated } from '../middleware/auth.middleware';
import { MatchController } from '../controllers/match.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    MatchController.list(req, res);
  });
});

router.get('/my-matches', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    MatchController.listMyMatches(req, res);
  });
});

export default router;
