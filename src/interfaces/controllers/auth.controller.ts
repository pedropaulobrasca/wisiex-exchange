import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../infrastructure/prisma/client';
import z from 'zod';

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
  }
}
