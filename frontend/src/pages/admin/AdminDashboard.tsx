import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData: any = await api.get('/admin/stats');
        setStats(statsData);

        const ordersData: any = await api.get('/admin/orders');
        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        toast.error('Unable to load dashboard data');
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-[#ffdbd0] text-[#5f1900] border-2 border-[#1e1b14] blob-border font-mono text-[10px] font-bold uppercase">
            Out there
          </span>
        );
      case 'COMPLETED':
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-[#daeb8d] text-[#181e00] border-2 border-[#1e1b14] blob-border font-mono text-[10px] font-bold uppercase">
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-[#ffdad6] text-[#93000a] border-2 border-[#1e1b14] blob-border font-mono text-[10px] font-bold uppercase">
            Boxed up
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 bg-[#e9e2d5] text-[#1e1b14] border-2 border-[#1e1b14] blob-border font-mono text-[10px] font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-12 bg-[#fff8f0]">
      {/* Title block */}
      <div>
        <h1 className="text-3xl font-sans font-black uppercase tracking-tight mb-2 text-[#1e1b14]">Dashboard</h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#594139] font-bold">Business activity overview</p>
      </div>

      {/* Summary of the Strange (Stats cards) */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-sans text-lg font-black text-[#1e1b14] uppercase tracking-wide flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#ab3500]">visibility</span>
            Summary of the Strange
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Stat Card 1 - Active Weirdos */}
          <div className="bg-[#f5ede0] border-4 border-[#1e1b14] blob-card-border p-6 shadow-[6px_6px_0px_0px_rgba(87,100,21,1)] jiggle transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ff6b35] rounded-full opacity-20 blob-border group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mb-1">Active Weirdos</p>
                <h3 className="font-sans text-3xl font-black text-[#1e1b14]">{stats.products}</h3>
              </div>
              <div className="w-12 h-12 bg-[#daeb8d] border-2 border-[#1e1b14] rounded-full flex items-center justify-center blob-border shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[#1e1b14] font-bold">pets</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#576415] font-black relative z-10">Total items in catalog</div>
          </div>

          {/* Stat Card 2 - Loot Shipped */}
          <div className="bg-[#f5ede0] border-4 border-[#1e1b14] blob-card-border p-6 shadow-[6px_6px_0px_0px_rgba(87,100,21,1)] jiggle transition-all group relative overflow-hidden -rotate-1">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#daeb8d] rounded-full opacity-20 blob-border group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mb-1">Loot Shipped</p>
                <h3 className="font-sans text-3xl font-black text-[#1e1b14]">{stats.orders}</h3>
              </div>
              <div className="w-12 h-12 bg-[#ff6b35] border-2 border-[#1e1b14] rounded-full flex items-center justify-center blob-border shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-white font-bold">local_shipping</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#ab3500] font-black relative z-10">Total orders received</div>
          </div>

          {/* Stat Card 3 - Fellow Weirdos */}
          <div className="bg-[#f5ede0] border-4 border-[#1e1b14] blob-card-border p-6 shadow-[6px_6px_0px_0px_rgba(87,100,21,1)] jiggle transition-all group relative overflow-hidden rotate-1">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#e9e2d5] rounded-full opacity-50 blob-border group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mb-1">Fellow Weirdos</p>
                <h3 className="font-sans text-3xl font-black text-[#1e1b14]">{stats.users}</h3>
              </div>
              <div className="w-12 h-12 bg-[#343027] border-2 border-[#1e1b14] rounded-full flex items-center justify-center blob-border shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[#f8f0e3] font-bold">groups</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#576415] font-black relative z-10">Registered customers</div>
          </div>

          {/* Stat Card 4 - Total Damage */}
          <div className="bg-[#f5ede0] border-4 border-[#1e1b14] blob-card-border p-6 shadow-[6px_6px_0px_0px_rgba(87,100,21,1)] jiggle transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ffdad6] rounded-full opacity-50 blob-border group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mb-1">Total Damage</p>
                <h3 className="font-sans text-3xl font-black text-[#1e1b14]">${stats.revenue.toFixed(2)}</h3>
              </div>
              <div className="w-12 h-12 bg-white border-2 border-[#1e1b14] rounded-full flex items-center justify-center blob-border shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[#ab3500] font-bold">payments</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#ab3500] font-black relative z-10">Gross sales revenue</div>
          </div>
        </div>
      </section>

      {/* Recent Orders table */}
      <section className="space-y-6">
        <h2 className="font-sans text-lg font-black text-[#1e1b14] uppercase tracking-wide flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#576415]">receipt_long</span>
          Recent Weirdness
        </h2>
        <div className="bg-[#efe7da] border-4 border-[#1e1b14] blob-card-border overflow-hidden shadow-[8px_8px_0px_0px_#1e1b14] p-4 lg:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-[#1e1b14]">
                  <th className="pb-4 font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider">Order #</th>
                  <th className="pb-4 font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider">Status</th>
                  <th className="pb-4 font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider">Customer</th>
                  <th className="pb-4 font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-[#1e1b14]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b-2 border-[#1e1b14]/20 hover:bg-[#f5ede0] transition-colors">
                    <td 
                      className="py-4 font-mono text-xs font-bold cursor-pointer hover:text-[#ab3500] transition-colors"
                      title="Click to copy full order ID"
                      onClick={() => {
                        navigator.clipboard.writeText(order.id);
                        toast.success('Full order ID copied!');
                      }}
                    >
                      #{order.id.split('-')[0]}...
                    </td>
                    <td className="py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e9e2d5] border-2 border-[#1e1b14] overflow-hidden hidden sm:flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1e1b14] text-lg leading-none">person</span>
                      </div>
                      <span className="font-bold">{order.user?.fullName || order.customerEmail}</span>
                    </td>
                    <td className="py-4 text-right font-mono font-bold">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center font-mono text-xs text-[#594139] font-bold">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
