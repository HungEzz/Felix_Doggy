import { Request, Response } from 'express';
import { orderService } from './order.service';
import { AuthenticatedRequest } from '../../types/auth';

export const orderController = {
  async checkout(req: Request, res: Response) {
    try {
      const result = await orderService.checkout(req.body, req.headers.authorization);
      res.status(201).json({ message: 'Order created successfully', ...result });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(400).json({ message: error.message || 'Checkout failed' });
    }
  },

  async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const orders = await orderService.getMyOrders(user.id);
      res.json(orders);
    } catch (error) {
      console.error('My orders error:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },

  /**
   * PayOS webhook handler.
   * Authentication is done via checksum signature verification, not JWT.
   * Always returns 200 to acknowledge receipt — PayOS retries on non-2xx.
   */
  async payosWebhook(req: Request, res: Response) {
    try {
      const result = await orderService.handlePayosWebhook(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error('PayOS webhook error:', error);
      // Still return 200 to prevent PayOS from retrying failed-validation webhooks
      // (e.g., invalid signature, amount mismatch). Logging captures the issue.
      res.status(200).json({ success: false, message: error.message });
    }
  },

  /**
   * Verify payment status after PayOS redirects user back to frontend.
   * Frontend calls this to get the real order status from server (not trusting URL params).
   */
  async verifyPayment(req: Request, res: Response) {
    try {
      const orderCode = parseInt(req.params.orderCode, 10);
      if (isNaN(orderCode)) {
        res.status(400).json({ message: 'Invalid orderCode' });
        return;
      }

      const order = await orderService.verifyPayment(orderCode);
      res.json({ order });
    } catch (error: any) {
      console.error('Verify payment error:', error);
      res.status(400).json({ message: error.message || 'Payment verification failed' });
    }
  },

  async trackOrder(req: Request, res: Response) {
    try {
      const { idOrCode } = req.params;
      const { contact } = req.query;

      if (!idOrCode) {
        res.status(400).json({ message: 'Order ID is required' });
        return;
      }
      if (!contact || typeof contact !== 'string') {
        res.status(400).json({ message: 'Contact info (email or phone) is required' });
        return;
      }

      const order = await orderService.trackOrder(idOrCode, contact);
      res.json(order);
    } catch (error: any) {
      console.error('Track order error:', error);
      res.status(400).json({ message: error.message || 'Failed to track order' });
    }
  },

  async cancelOrder(req: Request, res: Response) {
    try {
      const { idOrCode } = req.params;
      const { contact, cancelReason } = req.body;
      const authHeader = req.headers.authorization;

      const userId = orderService.getUserIdFromAuthHeader(authHeader);

      const order = await orderService.cancelOrder(idOrCode, contact, cancelReason, userId || undefined);
      res.json({ message: 'Order cancelled successfully', order });
    } catch (error: any) {
      console.error('Cancel order error:', error);
      res.status(400).json({ message: error.message || 'Failed to cancel order' });
    }
  },
};
