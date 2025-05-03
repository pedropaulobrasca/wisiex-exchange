import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../../application/database/prisma-client';
import { PrismaUserRepository } from '../../infrastructure/prisma/prisma-user-repo';

export class UserController {
  static async getBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const userRepository = new PrismaUserRepository();
      const balance = await userRepository.getBalance(userId);

      res.json(balance);
    } catch (error) {
      console.error('Erro ao obter saldo do usuário:', error);
      res.status(500).json({ error: 'Erro ao obter saldo do usuário' });
    }
  }
} 