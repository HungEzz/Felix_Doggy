import { Router } from 'express';
import { authController } from './auth.controller';
import { strictLimiter } from '../../middlewares/rateLimit';

export const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', strictLimiter, authController.login);
