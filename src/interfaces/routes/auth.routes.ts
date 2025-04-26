import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  await AuthController.login(req, res);
});

// Rota protegida para obter informações do usuário
router.get('/user', async (req: Request, res: Response) => {
  // Aplicar middleware de autenticação manualmente
  const middlewareFunction = async (req: Request, res: Response, next: () => void) => {
    await authMiddleware(req, res, next);
  };
  
  await new Promise<void>((resolve) => {
    middlewareFunction(req, res, () => resolve());
  }).catch(() => {
    // Se chegou aqui, o middleware já respondeu com erro
    return;
  });
  
  // Se chegou aqui, está autenticado
  if (req.user) {
    res.json({ user: req.user });
  }
});

export default router;
