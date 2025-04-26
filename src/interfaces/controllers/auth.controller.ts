import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../infrastructure/prisma/client';

export const AuthController = {
  login: async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

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
