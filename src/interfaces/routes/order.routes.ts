import { Router, Request, Response } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Função auxiliar para aplicar o middleware de autenticação
const applyAuthMiddleware = async (req: Request, res: Response): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    authMiddleware(req, res, () => resolve(true));
  }).catch(() => false);
};

// Rotas de ordem
router.post('/', async (req: Request, res: Response) => {
  const isAuthenticated = await applyAuthMiddleware(req, res);
  if (!isAuthenticated) return; // O middleware já respondeu com erro
  
  await OrderController.createOrder(req, res);
});

export default router; 