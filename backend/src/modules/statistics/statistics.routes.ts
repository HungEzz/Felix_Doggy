import { Router } from 'express';
import { statisticsController } from './statistics.controller';

export const statisticsRoutes = Router();

// Stats endpoints
statisticsRoutes.get('/revenue', statisticsController.getRevenue);
statisticsRoutes.get('/orders', statisticsController.getOrders);
statisticsRoutes.get('/products', statisticsController.getProducts);
statisticsRoutes.get('/users', statisticsController.getUsers);
statisticsRoutes.get('/inventory', statisticsController.getInventory);

// Export endpoints (return JSON — frontend generates Excel)
statisticsRoutes.get('/export/revenue', statisticsController.exportRevenue);
statisticsRoutes.get('/export/orders', statisticsController.exportOrders);
statisticsRoutes.get('/export/products', statisticsController.exportProducts);
statisticsRoutes.get('/export/users', statisticsController.exportUsers);
statisticsRoutes.get('/export/inventory', statisticsController.exportInventory);