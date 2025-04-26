import { Request, Response } from 'express';

export const HealthCheckController = {
  healthCheck: (req: Request, res: Response) => {
    res.status(200).json({ message: 'OK' });
  },
};
