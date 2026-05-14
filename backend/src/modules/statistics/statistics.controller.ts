import { Request, Response } from 'express';
import { statisticsService } from './statistics.service';

export const statisticsController = {
  // ── Revenue ────────────────────────────────────────────────────────────────
  async getRevenue(req: Request, res: Response) {
    try {
      const { period = 'month', startDate, endDate } = req.query;
      const data = await statisticsService.getRevenueStats(
        period as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(data);
    } catch (error) {
      console.error('Revenue stats error:', error);
      res.status(500).json({ message: 'Error fetching revenue statistics' });
    }
  },

  // ── Orders ─────────────────────────────────────────────────────────────────
  async getOrders(req: Request, res: Response) {
    try {
      const { period = 'month', startDate, endDate } = req.query;
      const data = await statisticsService.getOrderStats(
        period as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(data);
    } catch (error) {
      console.error('Order stats error:', error);
      res.status(500).json({ message: 'Error fetching order statistics' });
    }
  },

  // ── Products ───────────────────────────────────────────────────────────────
  async getProducts(req: Request, res: Response) {
    try {
      const { period = 'month', startDate, endDate } = req.query;
      const data = await statisticsService.getProductStats(
        period as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(data);
    } catch (error) {
      console.error('Product stats error:', error);
      res.status(500).json({ message: 'Error fetching product statistics' });
    }
  },

  // ── Users ──────────────────────────────────────────────────────────────────
  async getUsers(req: Request, res: Response) {
    try {
      const { period = 'month', startDate, endDate } = req.query;
      const data = await statisticsService.getUserStats(
        period as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(data);
    } catch (error) {
      console.error('User stats error:', error);
      res.status(500).json({ message: 'Error fetching user statistics' });
    }
  },

  // ── Inventory ──────────────────────────────────────────────────────────────
  async getInventory(_req: Request, res: Response) {
    try {
      const data = await statisticsService.getInventoryStats();
      res.json(data);
    } catch (error) {
      console.error('Inventory stats error:', error);
      res.status(500).json({ message: 'Error fetching inventory statistics' });
    }
  },

  // ── Exports ────────────────────────────────────────────────────────────────
  async exportRevenue(req: Request, res: Response) {
    try {
      const { period = 'month', startDate, endDate } = req.query;
      const orders = await statisticsService.getRevenueExport(
        period as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(orders);
    } catch (error) {
      console.error('Revenue export error:', error);
      res.status(500).json({ message: 'Error exporting revenue data' });
    }
  },

  async exportOrders(req: Request, res: Response) {
    try {
      const { period = 'month', startDate, endDate } = req.query;
      const orders = await statisticsService.getOrderExport(
        period as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(orders);
    } catch (error) {
      console.error('Orders export error:', error);
      res.status(500).json({ message: 'Error exporting orders data' });
    }
  },

  async exportProducts(_req: Request, res: Response) {
    try {
      const products = await statisticsService.getProductExport();
      res.json(products);
    } catch (error) {
      console.error('Products export error:', error);
      res.status(500).json({ message: 'Error exporting products data' });
    }
  },

  async exportUsers(_req: Request, res: Response) {
    try {
      const users = await statisticsService.getUserExport();
      res.json(users);
    } catch (error) {
      console.error('Users export error:', error);
      res.status(500).json({ message: 'Error exporting users data' });
    }
  },

  async exportInventory(_req: Request, res: Response) {
    try {
      const products = await statisticsService.getInventoryExport();
      res.json(products);
    } catch (error) {
      console.error('Inventory export error:', error);
      res.status(500).json({ message: 'Error exporting inventory data' });
    }
  },
};