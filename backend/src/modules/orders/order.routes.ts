import { Router } from 'express';
import { orderController } from './order.controller';
import { strictLimiter, webhookLimiter } from '../../middlewares/rateLimit';
import { verifyUser } from '../../middlewares/auth';

export const orderRoutes = Router();

orderRoutes.post('/checkout', strictLimiter, orderController.checkout);
orderRoutes.get('/my-orders', verifyUser, orderController.getMyOrders);

// PayOS webhook — NO auth middleware because authentication is done via checksum
// signature verification in payosService.verifyWebhookData(). Light rate limit to prevent spam.
orderRoutes.post('/webhook/payos', webhookLimiter, orderController.payosWebhook);

// Verify payment status after PayOS redirect — frontend calls this instead of trusting URL params
orderRoutes.get('/verify-payment/:orderCode', orderController.verifyPayment);
