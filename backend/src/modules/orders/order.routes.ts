import { Router } from 'express';
import { orderController } from './order.controller';
import { strictLimiter } from '../../middlewares/rateLimit';
import { verifyUser } from '../../middlewares/auth';

export const orderRoutes = Router();

orderRoutes.post('/checkout', strictLimiter, orderController.checkout);
orderRoutes.get('/my-orders', verifyUser, orderController.getMyOrders);
