import { Router } from 'express';
import { HealthCheckController } from '../controllers/health-check.controller';

const router = Router();

router.get('/', HealthCheckController.healthCheck);

export default router;
