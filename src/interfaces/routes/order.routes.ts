import { Router, Request, Response } from 'express';
import { OrderController } from '../controllers/order.controller';
import { ensureAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    OrderController.createOrder(req, res);
  });
});

router.delete('/:orderId', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    OrderController.cancelOrder(req, res);
  });
});

export default router;
