import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { PrismaUserRepository } from '../../infrastructure/prisma/prisma-user-repo';
import { GetUserBalance } from '../../application/use-cases/get-user-balance';

export class UserController {
  static async getBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const userRepository = new PrismaUserRepository();
      const getUserBalance = new GetUserBalance(userRepository);
      
      try {
        const balance = await getUserBalance.execute(userId);
        res.json(balance);
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    } catch (error) {
      console.error('Erro ao obter saldo do usuário:', error);
      res.status(500).json({ error: 'Erro ao obter saldo do usuário' });
    }
  }
} 