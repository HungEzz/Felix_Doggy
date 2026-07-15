import React, { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  StatCard, StatsPageHeader, ChartCard, StatsSkeleton, EmptyState,
  useStatsData, exportToExcel, fmtCurrency, fmtDate, OrderStatusBadge,
  CHART_COLORS, PIE_COLORS, type DateFilter,
} from '../../../components/admin/StatsUtils';

interface OrderStatsData {
  summary: {
    total: number;
    statusCounts: { status: string; count: number }[];
  };
  chartData: { date: string; revenue: number; count: number }[];
  recentOrders: any[];
  period: { start: string; end: string };
}

const today = new Date().toISOString().split('T')[0];
const firstDayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

const STATUS_COLORS: Record<string, string> = {
  PENDING:    CHART_COLORS.amber,
  COMPLETED:  CHART_COLORS.accent,
  CANCELLED:  CHART_COLORS.rose,
  SHIPPED:    CHART_COLORS.purple,
  PROCESSING: CHART_COLORS.blue,
};

const OrderStats: React.FC = () => {
  const [filter, setFilter] = useState<DateFilter>({
    period: 'month',
    startDate: firstDayMonth,
    endDate: today,
  });
  const [exporting, setExporting] = useState(false);

  const { data, loading } = useStatsData<OrderStatsData>('orders', filter);

  const handleExport = async () => {
    setExporting(true);
    await exportToExcel(
      'export/orders',
      { period: filter.period, ...(filter.period === 'custom' ? { startDate: filter.startDate, endDate: filter.endDate } : {}) },
      'orders',
      [
        { key: 'orderId', label: 'Order ID' },
        { key: 'status', label: 'Status' },
        { key: 'customerEmail', label: 'Email' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'shippingAddr', label: 'Address' },
        { key: 'itemCount', label: 'Items' },
        { key: 'totalAmount', label: 'Total ($)', format: (v) => Number(v).toFixed(2) },
        { key: 'createdAt', label: 'Date Placed', format: (v) => fmtDate(v) },
      ],
      (orders: any[]) =>
        orders.map((o: any) => ({
          orderId: o.id,
          status: o.status,
          customerEmail: o.customerEmail || o.user?.email || '',
          customerName: o.user?.fullName || 'Guest',
          shippingAddr: o.shippingAddr || '',
          itemCount: o.orderItems?.length || 0,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt,
        })),
    );
    setExporting(false);
  };

  const statusCounts = data?.summary.statusCounts || [];
  const pieData = statusCounts.filter((s) => s.count > 0).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  const getCount = (status: string) =>
    statusCounts.find((s) => s.status === status)?.count ?? 0;

  const chartData = data?.chartData || [];
  const recentOrders = data?.recentOrders || [];

  const tooltipStyle = { borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-primary)' };

  return (
    <div>
      <StatsPageHeader
        title="Order Statistics"
        subtitle="Track status and trends of orders"
        icon={<ShoppingBag size={22} />}
        color="#3b82f6"
        filter={filter}
        onFilterChange={setFilter}
        onExport={handleExport}
        exporting={exporting}
      />

      {loading ? (
        <StatsSkeleton />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stat cards */}
          <div className="stats-grid-container cols-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <StatCard title="Total Orders" value={data?.summary.total ?? 0} icon={<ShoppingBag size={16} />} color="#3b82f6" />
            <StatCard title="Pending" value={getCount('PENDING')} icon={<Clock size={16} />} color={CHART_COLORS.amber} />
            <StatCard title="Shipped" value={getCount('SHIPPED')} icon={<Truck size={16} />} color={CHART_COLORS.purple} />
            <StatCard title="Completed" value={getCount('COMPLETED')} icon={<CheckCircle size={16} />} color={CHART_COLORS.accent} />
            <StatCard title="Cancelled" value={getCount('CANCELLED')} icon={<XCircle size={16} />} color={CHART_COLORS.rose} />
          </div>

          {/* Charts row */}
          <div className="charts-row-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Pie chart */}
            <ChartCard title="Status Distribution" subtitle="Order status proportions" minHeight={280}>
              {pieData.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [String(value), String(name)]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend
                      formatter={(value) => {
                        const labels: Record<string, string> = {
                          PENDING: 'Pending', COMPLETED: 'Completed',
                          CANCELLED: 'Cancelled', SHIPPED: 'Shipped', PROCESSING: 'Processing',
                        };
                        return labels[value] || value;
                      }}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Bar chart */}
            <ChartCard title="Daily Orders" minHeight={280}>
              {chartData.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}
                      tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: unknown) => [String(value), 'Orders']}
                      labelFormatter={(label) => fmtDate(label)}
                      contentStyle={tooltipStyle}
                    />
                    <Bar dataKey="count" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Recent orders table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                Recent Orders
              </h3>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ padding: 32 }}><EmptyState /></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)' }}>
                      {['Order ID', 'Customer', 'Items', 'Total Price', 'Status', 'Date Placed'].map((h) => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order: any, i) => (
                      <tr key={order.id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                          #{order.id.split('-')[0].toUpperCase()}
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{order.user?.fullName || 'Guest'}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.customerEmail}</p>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{order.orderItems?.length || 0} items</td>
                        <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{fmtCurrency(order.totalAmount)}</td>
                        <td style={{ padding: '11px 16px' }}><OrderStatusBadge status={order.status} /></td>
                        <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .charts-row-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderStats;