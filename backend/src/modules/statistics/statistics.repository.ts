import { prisma } from '../../config/prisma';

export const statisticsRepository = {
  // ─── Revenue ──────────────────────────────────────────────────────────────
  getRevenueStats: async (startDate: Date, endDate: Date) => {
    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { totalAmount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return orders;
  },

  getRevenueSummary: async (startDate: Date, endDate: Date) => {
    const [completed, all] = await Promise.all([
      prisma.order.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: startDate, lte: endDate } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startDate, lte: endDate } },
        _sum: { totalAmount: true },
        _count: true,
      }),
    ]);
    return { completed, all };
  },

  getRevenueForExport: async (startDate: Date, endDate: Date) => {
    return prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate, lte: endDate },
      },
      include: {
        user: { select: { fullName: true, email: true } },
        orderItems: { include: { product: { select: { title: true, category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ─── Orders ────────────────────────────────────────────────────────────────
  getOrderStats: async (startDate: Date, endDate: Date) => {
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { status: true, totalAmount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return orders;
  },

  getOrderStatusCounts: async (startDate: Date, endDate: Date) => {
    const statuses = ['PENDING', 'COMPLETED', 'CANCELLED', 'SHIPPED', 'PROCESSING'];
    const counts = await Promise.all(
      statuses.map((status) =>
        prisma.order.count({
          where: { status, createdAt: { gte: startDate, lte: endDate } },
        }).then((count) => ({ status, count }))
      )
    );
    return counts;
  },

  getRecentOrders: async (limit = 10) => {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        orderItems: { include: { product: { select: { title: true } } } },
      },
    });
  },

  getOrdersForExport: async (startDate: Date, endDate: Date) => {
    return prisma.order.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      include: {
        user: { select: { fullName: true, email: true } },
        orderItems: { include: { product: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ─── Products ──────────────────────────────────────────────────────────────
  getTopSellingProducts: async (startDate: Date, endDate: Date, limit = 10) => {
    const result = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: 'COMPLETED',
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      _sum: { quantity: true, priceAtTime: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productIds = result.map((r) => r.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, artist: true, category: true, price: true, stock: true },
    });

    return result.map((r) => {
      const product = products.find((p) => p.id === r.productId);
      return {
        productId: r.productId,
        totalQuantity: r._sum.quantity ?? 0,
        totalRevenue: (r._sum.quantity ?? 0) * (product?.price ?? 0),
        orderCount: r._count,
        product,
      };
    });
  },

  getCategoryStats: async (startDate: Date, endDate: Date) => {
    const items = await prisma.orderItem.findMany({
      where: {
        order: {
          status: 'COMPLETED',
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      include: { product: { select: { category: true } } },
    });

    const byCategory: Record<string, { count: number; revenue: number }> = {};
    items.forEach((item) => {
      const cat = item.product?.category || 'unknown';
      if (!byCategory[cat]) byCategory[cat] = { count: 0, revenue: 0 };
      byCategory[cat].count += item.quantity;
      byCategory[cat].revenue += item.quantity * item.priceAtTime;
    });

    return Object.entries(byCategory).map(([category, data]) => ({ category, ...data }));
  },

  getTotalProducts: () => prisma.product.count(),
  getAllProducts: () => prisma.product.findMany({ orderBy: { id: 'asc' } }),

  // ─── Users ─────────────────────────────────────────────────────────────────
  getUserStats: async (startDate: Date, endDate: Date) => {
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    });
    return users;
  },

  getTotalUsers: () => prisma.user.count({ where: { role: 'USER' } }),

  getTopCustomers: async (startDate: Date, endDate: Date, limit = 10) => {
    const result = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        status: 'COMPLETED',
        userId: { not: null },
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { totalAmount: true },
      _count: true,
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: limit,
    });

    const userIds = result.map((r) => r.userId).filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, email: true, createdAt: true },
    });

    return result.map((r) => {
      const user = users.find((u) => u.id === r.userId);
      return {
        userId: r.userId,
        totalSpent: r._sum.totalAmount ?? 0,
        orderCount: r._count,
        user,
      };
    });
  },

  getUsersForExport: async () => {
    return prisma.user.findMany({
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ─── Inventory ─────────────────────────────────────────────────────────────
  getInventoryStats: async () => {
    const products = await prisma.product.findMany({
      orderBy: { stock: 'asc' },
    });
    return products;
  },

  getLowStockProducts: async (threshold = 5) => {
    return prisma.product.findMany({
      where: { stock: { gt: 0, lte: threshold } },
      orderBy: { stock: 'asc' },
    });
  },

  getOutOfStockProducts: async () => {
    return prisma.product.findMany({
      where: { stock: 0 },
    });
  },
};