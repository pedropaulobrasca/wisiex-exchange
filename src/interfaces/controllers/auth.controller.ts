import { Request, Response } from 'express';
import z from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { PrismaUserRepository } from '../../infrastructure/prisma/prisma-user-repo';
import { LoginUser } from '../../application/use-cases/login-user';
import { GetUser } from '../../application/use-cases/get-user';

export class AuthController {
  static async login(req: Request, res: Response) {
    const userRepository = new PrismaUserRepository();
    const loginUser = new LoginUser(userRepository);
    
    const schema = z.object({
      username: z.string().min(1),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const { username } = result.data;

    try {
      const { token } = await loginUser.execute(username);
      res.status(200).json({ token });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getUser(req: AuthenticatedRequest, res: Response) {
    const userRepository = new PrismaUserRepository();
    const getUserUseCase = new GetUser(userRepository);

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;

    try {
      const user = await getUserUseCase.execute(userId);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({ message: 'User not found' });
      }
      console.error('Erro ao obter usuário:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
