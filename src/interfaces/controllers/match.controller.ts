import { Response } from 'express';
import { PrismaMatchRepository } from '../../infrastructure/prisma/prisma-match-repo';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { GetAllMatches } from '../../application/use-cases/get-all-matches';
import { GetUserMatches } from '../../application/use-cases/get-user-matches';

export class MatchController {
  static async list(req: AuthenticatedRequest, res: Response) {
    try {
      const matchRepository = new PrismaMatchRepository();
      const getAllMatches = new GetAllMatches(matchRepository);
      
      const matches = await getAllMatches.execute();
      return res.json(matches);
    } catch (error) {
      console.error('Erro ao listar matches:', error);
      return res.status(500).json({ error: 'Erro ao listar matches' });
    }
  }

  static async listMyMatches(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const matchRepository = new PrismaMatchRepository();
      const getUserMatches = new GetUserMatches(matchRepository);
      
      const matches = await getUserMatches.execute(userId);
      return res.json(matches);
    } catch (error: any) {
      console.error('Erro ao listar matches do usuário:', error);
      return res.status(500).json({ error: error.message || 'Erro ao listar matches do usuário' });
    }
  }
}
