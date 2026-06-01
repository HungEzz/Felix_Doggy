import { Request, Response } from 'express';
import { orderService } from './order.service';
import { AuthenticatedRequest } from '../../types/auth';

export const orderController = {
  async checkout(req: Request, res: Response) {
    try {
      const order = await orderService.checkout(req.body, req.headers.authorization);
      res.status(201).json({ message: 'Order created successfully', order });
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
};
