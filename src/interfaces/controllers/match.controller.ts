import { Response } from 'express';
import { PrismaMatchRepository } from '../../infrastructure/prisma/prisma-match-repo';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class MatchController {
  static async list(req: AuthenticatedRequest, res: Response) {
    const matchRepository = new PrismaMatchRepository();
    const matches = await matchRepository.findAll();
    return res.json(matches);
  }

  static async listMyMatches(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    const matchRepository = new PrismaMatchRepository();
    const matches = await matchRepository.findByUserId(userId);
    return res.json(matches);
  }
}
