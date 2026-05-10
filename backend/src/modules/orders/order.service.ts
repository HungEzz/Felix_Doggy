import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { withRetry } from '../../utils/retry';
import { orderRepository } from './order.repository';

export const orderService = {
  getUserIdFromAuthHeader(authHeader?: string) {
    try {
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        return decoded.userId;
      }
      return null;
    } catch {
      return null;
    }
  },

  async checkout(body: any, authHeader?: string) {
    const { customerEmail, customerPhone, shippingAddr, items } = body;
    if (!items || !items.length) {
      throw new Error('Cart is empty');
    }

    const userId = this.getUserIdFromAuthHeader(authHeader);

    const order = await withRetry(
      () => orderRepository.createCheckoutOrder(userId, customerEmail, customerPhone, shippingAddr, items),
      { maxAttempts: 3, baseDelayMs: 500, label: 'checkout transaction' },
    );

    return order;
  },

  getMyOrders(userId: string) {
    return orderRepository.findMyOrders(userId);
  },
};
