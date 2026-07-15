import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { withRetry } from '../../utils/retry';
import { orderRepository } from './order.repository';
import { authRepository } from '../auth/auth.repository';
import { productCache } from '../products/product.cache';
import { payosService } from './payos.service';

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
    const { customerEmail, customerPhone, customerName, shippingAddr, items, paymentMethod = 'cod' } = body;
    if (!items || !items.length) {
      throw new Error('Cart is empty');
    }

    const userId = this.getUserIdFromAuthHeader(authHeader);

    const order = await withRetry(
      () => orderRepository.createCheckoutOrder(userId, customerEmail, customerPhone, shippingAddr, items, paymentMethod),
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

    // If PayOS payment, create payment link and return checkoutUrl for redirect
    if (paymentMethod === 'payos') {
      const EXCHANGE_RATE = 25000; // Convert USD database prices to VND
      const amountInVnd = order.totalAmount * EXCHANGE_RATE;

      if (amountInVnd < 2000) {
        throw new Error('Minimum payment amount via PayOS is 2,000 VND (approx $0.08). Please add more items or increase quantity.');
      }

      const paymentItems = order.orderItems.map((oi: any) => ({
        name: oi.product?.title || `Product #${oi.productId}`,
        quantity: oi.quantity,
        price: Math.round(oi.priceAtTime * EXCHANGE_RATE),
      }));

      const paymentLink = await payosService.createPaymentLink({
        orderCode: order.orderCode,
        amount: Math.round(amountInVnd),
        description: `DH ${order.orderCode}`,
        items: paymentItems,
      });

      return { order, checkoutUrl: paymentLink.checkoutUrl };
    }

    // COD — return order directly
    return { order };
  },

  /**
   * Handle PayOS webhook callback.
   * Performs 3 security checks: signature verification, idempotency, and amount matching.
   */
  async handlePayosWebhook(body: any) {
    // Check top-level success code from webhook body before verifying
    if (body.code !== '00') {
      console.warn(`PayOS webhook non-success code: ${body.code} — ${body.desc}`);
      return null;
    }

    // Step 1: Verify checksum signature — throws if invalid
    // verifyPaymentWebhookData returns the `data` object directly (not the full body)
    const webhookData = payosService.verifyWebhookData(body);

    const { orderCode, amount, paymentLinkId } = webhookData;

    // Step 2: Find order and check idempotency
    const order = await orderRepository.findOrderByCode(orderCode);
    if (!order) {
      throw new Error(`Order not found for orderCode: ${orderCode}`);
    }
    if (order.status !== 'PENDING_PAYMENT') {
      // Already processed — skip duplicate webhook (PayOS may retry)
      console.log(`PayOS webhook: order ${orderCode} already processed (status: ${order.status}), skipping.`);
      return order;
    }

    // Step 3: Verify amount matches — anti-tampering check
    const EXCHANGE_RATE = 25000;
    const expectedAmountInVnd = Math.round(order.totalAmount * EXCHANGE_RATE);
    if (amount !== expectedAmountInVnd) {
      console.error(
        `⚠️ AMOUNT MISMATCH: order ${order.orderCode} expected ${expectedAmountInVnd} VND, got ${amount} VND`,
      );
      throw new Error('Payment amount mismatch');
    }

    // All checks passed — update order status
    return orderRepository.updateOrderPayment(order.orderCode, paymentLinkId);
  },

  /**
   * Verify payment status after PayOS redirects user back.
   * Does NOT trust query params — verifies from DB + PayOS API.
   */
  async verifyPayment(orderCode: number) {
    const order = await orderRepository.findOrderByCode(orderCode);
    if (!order) {
      throw new Error('Order not found');
    }

    // If webhook hasn't arrived yet, proactively check with PayOS API
    if (order.status === 'PENDING_PAYMENT') {
      try {
        const paymentInfo = await payosService.getPaymentInfo(orderCode);
        if (paymentInfo.status === 'PAID') {
          // Webhook was delayed — manually update
          const updated = await orderRepository.updateOrderPayment(orderCode, paymentInfo.id);
          return updated;
        }
      } catch (err) {
        console.warn(`PayOS getPaymentInfo failed for orderCode ${orderCode}:`, err);
        // Fall through — return current order state
      }
    }

    return order;
  },

  getMyOrders(userId: string) {
    return orderRepository.findMyOrders(userId);
  },
};
