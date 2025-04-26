import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';
import prisma from '../../app/database/prisma-client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const AuthController = {
  login: async (req: Request, res: Response) => {
    const schema = z.object({
      username: z.string().min(1),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const { username } = result.data;

    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          usdBalance: 100_000,
          btcBalance: 100,
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  },

  getUser: async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  },
}
