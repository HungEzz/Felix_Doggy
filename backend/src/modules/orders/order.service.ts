import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { withRetry } from '../../utils/retry';
import { orderRepository } from './order.repository';
import { authRepository } from '../auth/auth.repository';
import { productCache } from '../products/product.cache';

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
    const { customerEmail, customerPhone, customerName, shippingAddr, items } = body;
    if (!items || !items.length) {
      throw new Error('Cart is empty');
    }

    const userId = this.getUserIdFromAuthHeader(authHeader);

    const order = await withRetry(
      () => orderRepository.createCheckoutOrder(userId, customerEmail, customerPhone, shippingAddr, items),
      { maxAttempts: 3, baseDelayMs: 500, label: 'checkout transaction' },
    );

    // Invalidate Redis cache for ordered products so stock is fresh
    try {
      for (const item of items) {
        await productCache.deleteCachedProduct(item.id);
      }
    } catch {
      // Non-critical — don't fail the order if cache invalidation fails
    }

    // Save shipping info to user profile (fill empty fields only)
    if (userId) {
      try {
        const user = await authRepository.findUserById(userId);
        if (user) {
          const updates: { fullName?: string; phone?: string; address?: string } = {};
          if (!user.fullName && customerName) updates.fullName = customerName;
          if (!user.phone && customerPhone) updates.phone = customerPhone;
          if (!user.address && shippingAddr) updates.address = shippingAddr;
          if (Object.keys(updates).length > 0) {
            await authRepository.updateUser(userId, updates);
          }
        }
      } catch {
        // Non-critical — don't fail the order if profile update fails
      }
    }

    return order;
  },

  getMyOrders(userId: string) {
    return orderRepository.findMyOrders(userId);
  },
};
