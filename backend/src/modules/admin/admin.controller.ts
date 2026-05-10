import { Request, Response } from 'express';
import { adminService } from './admin.service';

export const adminController = {
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await adminService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ message: 'Error fetching stats' });
    }
  },

  async getUsers(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const users = await adminService.getUsers(page, limit);
      res.json(users);
    } catch (error) {
      console.error('Admin users error:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  async updateUserRole(req: Request, res: Response) {
    try {
      const { role } = req.body;
      const updatedUser = await adminService.updateUserRole(req.params.id, role);
      res.json(updatedUser);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ message: 'Error updating user role' });
    }
  },

  async getOrders(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const orders = await adminService.getOrders(page, limit);
      res.json(orders);
    } catch (error) {
      console.error('Admin orders error:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const order = await adminService.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Error updating order' });
    }
  },
};
