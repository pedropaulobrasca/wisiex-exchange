import { Router, Request, Response } from 'express';
import { ensureAuthenticated, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.get('/balance', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    UserController.getBalance(req, res);
  });
});

export default router; 