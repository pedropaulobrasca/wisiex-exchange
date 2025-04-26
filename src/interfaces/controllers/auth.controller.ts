import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../infrastructure/prisma/client';

export const AuthController = {
  login: async (req: Request, res: Response) => {
    res.json({ message: 'Hello, world!' });
  }
}
