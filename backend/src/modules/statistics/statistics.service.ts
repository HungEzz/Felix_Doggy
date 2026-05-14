import { statisticsRepository } from './statistics.repository';

// ─── Date helpers ──────────────────────────────────────────────────────────────
export const getDateRange = (period: string, startDate?: string, endDate?: string) => {
  const now = new Date();

  switch (period) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      return { start, end };
    }
    case 'week': {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0);
      const end = new Date();
      return { start, end };
    }
    case 'year': {
      const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      const end = new Date();
      return { start, end };
    }
    case 'custom': {
      if (startDate && endDate) {
        return { start: new Date(startDate + 'T00:00:00'), end: new Date(endDate + 'T23:59:59') };
      }
      // Fall through to month
    }
    default: {
      // month
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const end = new Date();
      return { start, end };
    }
  }
};

// Group orders by day for chart data
const groupByDay = (items: { createdAt: Date; totalAmount?: number }[]) => {
  const map: Record<string, { date: string; revenue: number; count: number }> = {};
  items.forEach((item) => {
    const date = item.createdAt.toISOString().split('T')[0];
    if (!map[date]) map[date] = { date, revenue: 0, count: 0 };
    map[date].revenue += item.totalAmount ?? 0;
    map[date].count += 1;
  });
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
};

// ─── Service ───────────────────────────────────────────────────────────────────
export const statisticsService = {
  // Revenue
  async getRevenueStats(period: string, startDate?: string, endDate?: string) {
    const { start, end } = getDateRange(period, startDate, endDate);
    const [orders, summary] = await Promise.all([
      statisticsRepository.getRevenueStats(start, end),
      statisticsRepository.getRevenueSummary(start, end),
    ]);

    const chartData = groupByDay(orders);

    const totalRevenue = summary.completed._sum.totalAmount ?? 0;
    const completedOrders = summary.completed._count ?? 0;
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    return {
      summary: {
        totalRevenue,
        completedOrders,
        avgOrderValue,
        totalOrders: summary.all._count ?? 0,
      },
      chartData,
      period: { start: start.toISOString(), end: end.toISOString() },
    };
  },

  async getRevenueExport(period: string, startDate?: string, endDate?: string) {
    const { start, end } = getDateRange(period, startDate, endDate);
    return statisticsRepository.getRevenueForExport(start, end);
  },

  // Orders
  async getOrderStats(period: string, startDate?: string, endDate?: string) {
    const { start, end } = getDateRange(period, startDate, endDate);
    const [orders, statusCounts, recentOrders] = await Promise.all([
      statisticsRepository.getOrderStats(start, end),
      statisticsRepository.getOrderStatusCounts(start, end),
      statisticsRepository.getRecentOrders(10),
    ]);

    const chartData = groupByDay(orders);

    return {
      summary: {
        total: orders.length,
        statusCounts,
      },
      chartData,
      recentOrders,
      period: { start: start.toISOString(), end: end.toISOString() },
    };
  },

  async getOrderExport(period: string, startDate?: string, endDate?: string) {
    const { start, end } = getDateRange(period, startDate, endDate);
    return statisticsRepository.getOrdersForExport(start, end);
  },

  // Products
  async getProductStats(period: string, startDate?: string, endDate?: string) {
    const { start, end } = getDateRange(period, startDate, endDate);
    const [topProducts, categoryStats, totalProducts] = await Promise.all([
      statisticsRepository.getTopSellingProducts(start, end, 10),
      statisticsRepository.getCategoryStats(start, end),
      statisticsRepository.getTotalProducts(),
    ]);

    return {
      summary: { totalProducts },
      topProducts,
      categoryStats,
      period: { start: start.toISOString(), end: end.toISOString() },
    };
  },

  async getProductExport() {
    const products = await statisticsRepository.getAllProducts();
    return products;
  },

  // Users
  async getUserStats(period: string, startDate?: string, endDate?: string) {
    const { start, end } = getDateRange(period, startDate, endDate);
    const [userStats, topCustomers, totalUsers] = await Promise.all([
      statisticsRepository.getUserStats(start, end),
      statisticsRepository.getTopCustomers(start, end, 10),
      statisticsRepository.getTotalUsers(),
    ]);

    const chartData = groupByDay(userStats.map((u) => ({ createdAt: u.createdAt })));

    return {
      summary: {
        totalUsers,
        newUsersInPeriod: userStats.length,
      },
      chartData,
      topCustomers,
      period: { start: start.toISOString(), end: end.toISOString() },
    };
  },

  async getUserExport() {
    return statisticsRepository.getUsersForExport();
  },

  // Inventory
  async getInventoryStats() {
    const [allProducts, lowStock, outOfStock] = await Promise.all([
      statisticsRepository.getInventoryStats(),
      statisticsRepository.getLowStockProducts(5),
      statisticsRepository.getOutOfStockProducts(),
    ]);

    const totalValue = allProducts.reduce((sum, p) => sum + p.price * p.stock, 0);
    const byCategory: Record<string, { count: number; value: number; items: number }> = {};
    allProducts.forEach((p) => {
      const cat = p.category;
      if (!byCategory[cat]) byCategory[cat] = { count: 0, value: 0, items: 0 };
      byCategory[cat].count += 1;
      byCategory[cat].value += p.price * p.stock;
      byCategory[cat].items += p.stock;
    });

    return {
      summary: {
        totalProducts: allProducts.length,
        totalStockValue: totalValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
      },
      allProducts,
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStock,
      categoryBreakdown: Object.entries(byCategory).map(([category, data]) => ({ category, ...data })),
    };
  },

  async getInventoryExport() {
    return statisticsRepository.getInventoryStats();
  },
};