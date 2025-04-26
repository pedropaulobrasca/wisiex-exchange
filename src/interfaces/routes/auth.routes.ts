import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ensureAuthenticated, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  await AuthController.login(req, res);
});

// Rota protegida para obter informações do usuário
router.get('/user', (req: Request, res: Response) => {
  ensureAuthenticated(req as AuthenticatedRequest, res, () => {
    AuthController.getUser(req as AuthenticatedRequest, res);
  });
});

export default router;
