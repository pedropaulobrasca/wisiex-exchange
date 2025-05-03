import { Router, Request, Response } from 'express';
import { OrderBookController } from '../controllers/order-book.controller';
import { ensureAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  ensureAuthenticated(req, res, () => {
    OrderBookController.list(req, res);
  });
});

export { router as orderBookRoutes };
