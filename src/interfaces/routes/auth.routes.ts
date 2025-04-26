import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  await AuthController.login(req, res);
});

export default router;
