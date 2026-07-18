import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data: any = await api.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Error loading orders');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  // Calculations for Metrics
  const openOrdersCount = orders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  ).length;

  const avgWeirdnessValue =
    orders.length > 0
      ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length
      : 0;

  const shippingHurdlesCount = orders.filter((o) => o.status === 'PENDING').length;

  // Filter and Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.fullName &&
        order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customerEmail &&
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      order.status.toUpperCase() === statusFilter ||
      (statusFilter === 'COMPLETED' && order.status.toUpperCase() === 'DELIVERED');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-12 bg-[#fff8f0]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {/* CSS Utilities */}
      <style>{`
        .blob-border {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .blob-card-1 {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .blob-card-2 {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        .blob-card-3 {
          border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%;
        }
        .wavy-border {
          border-bottom: 2px solid #1e1b14;
          border-image: url("data:image/svg+xml,%3Csvg width='100' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 2 Q 25 0, 50 2 T 100 2' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E") 2 stretch;
        }
        .hard-shadow {
          box-shadow: 4px 4px 0px 0px #576415;
        }
        .hard-shadow-table {
          box-shadow: 6px 6px 0px 0px #1e1b14;
        }
      `}</style>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-sans text-3xl font-black text-[#1e1b14] uppercase tracking-tight mb-2">The Loot List</h2>
          <p className="font-sans text-sm text-[#594139] font-bold">Tracking the strange journeys of every order.</p>
        </div>
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-end w-full md:w-auto">
          <div className="relative group w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#594139] group-focus-within:text-[#ab3500] transition-colors pointer-events-none">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-[#f5ede0] rounded-none border-2 border-[#1e1b14] focus:border-[#ab3500] focus:ring-0 font-mono text-xs w-full focus:outline-none text-[#1e1b14]"
              placeholder="Search weirdness..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-[#fbf3e6] border-2 border-[#1e1b14] p-6 blob-card-1 hard-shadow flex flex-col items-center justify-center text-center transform -rotate-1">
          <span className="material-symbols-outlined text-4xl text-[#ab3500] mb-2 font-bold">package_2</span>
          <h3 className="font-sans text-3xl font-black text-[#1e1b14]">{openOrdersCount}</h3>
          <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mt-1">Open Orders</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#daeb8d] border-2 border-[#1e1b14] p-6 blob-card-2 hard-shadow flex flex-col items-center justify-center text-center transform rotate-2">
          <span className="material-symbols-outlined text-4xl text-[#576415] mb-2 font-bold">price_check</span>
          <h3 className="font-sans text-3xl font-black text-[#181e00]">${avgWeirdnessValue.toFixed(2)}</h3>
          <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mt-1">Avg. Weirdness Value</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#ffdad6] border-2 border-[#1e1b14] p-6 blob-card-3 hard-shadow flex flex-col items-center justify-center text-center transform -rotate-2">
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a] mb-2 font-bold">warning</span>
          <h3 className="font-sans text-3xl font-black text-[#93000a]">{shippingHurdlesCount}</h3>
          <p className="font-mono text-[10px] text-[#594139] font-black uppercase tracking-wider mt-1 font-bold">Shipping Hurdles</p>
        </div>
      </section>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {(['ALL', 'PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`font-mono text-xs px-4 py-2 rounded-full border-2 border-[#1e1b14] transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-[#576415] text-white shadow-[2px_2px_0px_0px_#1e1b14]'
                : 'bg-[#f5ede0] hover:bg-[#efe7da] text-[#1e1b14]'
            }`}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Data Table Container */}
      <div className="bg-white border-4 border-[#1e1b14] p-4 sm:p-8 hard-shadow-table overflow-hidden relative" style={{ borderRadius: '16px 24px 12px 32px' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-[#1e1b14] font-sans text-sm font-black text-[#1e1b14] uppercase tracking-wide">
                <th className="p-4 whitespace-nowrap">Order ID</th>
                <th className="p-4 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">Total</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-[#1e1b14]">
              {filteredOrders.map((item) => (
                <tr key={item.id} className="wavy-border hover:bg-[#fbf3e6] transition-colors group">
                  <td
                    className="p-4 font-mono text-xs text-[#ab3500] font-black cursor-pointer hover:underline"
                    title="Click to copy full order ID"
                    onClick={() => {
                      navigator.clipboard.writeText(item.id);
                      toast.success('Full order ID copied!');
                    }}
                  >
                    #W-{item.id.substring(0, 5).toUpperCase()}
                  </td>
                  <td className="p-4 text-[#594139] font-mono text-xs">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f5ede0] border-2 border-[#1e1b14] flex items-center justify-center shrink-0 blob-border overflow-hidden">
                        <span className="material-symbols-outlined text-[#1e1b14] text-lg font-bold">person</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{item.user?.fullName || 'Guest'}</span>
                        <span className="font-mono text-[10px] text-[#594139] font-bold">{item.customerEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs font-black">${item.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={item.status.toUpperCase()}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="bg-[#daeb8d] text-[#181e00] border-2 border-[#1e1b14] font-mono text-[10px] font-black uppercase pl-3 pr-8 py-1 rounded-full cursor-pointer focus:outline-none appearance-none hover:bg-[#becf74] transition-all"
                        style={{
                          backgroundColor:
                            item.status.toUpperCase() === 'PENDING'
                              ? '#ffdbd0'
                              : item.status.toUpperCase() === 'CANCELLED'
                              ? '#ffdad6'
                              : '#daeb8d',
                          color:
                            item.status.toUpperCase() === 'PENDING'
                              ? '#5f1900'
                              : item.status.toUpperCase() === 'CANCELLED'
                              ? '#93000a'
                              : '#181e00',
                        }}
                      >
                        <option value="PENDING">Out there</option>
                        <option value="SHIPPED">On road</option>
                        <option value="COMPLETED">Delivered</option>
                        <option value="CANCELLED">Boxed up</option>
                      </select>
                      {/* Down arrow marker */}
                      <span className="material-symbols-outlined absolute right-2 top-1.5 text-xs text-[#1e1b14] pointer-events-none font-bold">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(item)}
                      className="p-2 rounded-full hover:bg-[#efe7da] text-[#1e1b14] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg font-bold">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-[#594139]/40 mb-2">sentiment_dissatisfied</span>
                    <p className="font-mono text-sm text-[#594139] font-bold">No orders found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[#fff8f0] border-4 border-[#1e1b14] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_#1e1b14] rounded-[24px]">
            <div className="text-xl font-sans font-black uppercase tracking-wider mb-6 pb-4 border-b-4 border-[#1e1b14] text-[#1e1b14] flex justify-between items-center">
              <span>Order Details #W-{selectedOrder.id.substring(0, 5).toUpperCase()}</span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#1e1b14] hover:text-[#ab3500] cursor-pointer flex"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-8 p-6 bg-[#efe7da] border-2 border-[#1e1b14] blob-border">
              <div>
                <p className="font-mono text-[10px] uppercase font-black text-[#594139] mb-1">Customer</p>
                <p className="font-bold text-[#1e1b14]">{selectedOrder.user?.fullName || 'Guest'}</p>
                <p className="font-mono text-xs text-[#594139]">{selectedOrder.customerEmail}</p>
                <p className="font-mono text-xs text-[#594139]">{selectedOrder.customerPhone || 'No phone number'}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase font-black text-[#594139] mb-1">Shipping Address</p>
                <p className="font-mono text-xs text-[#594139] leading-relaxed">
                  {selectedOrder.shippingAddr || 'No shipping address'}
                </p>
              </div>
            </div>

            <h3 className="font-mono text-[10px] font-black uppercase text-[#594139] mb-4">Ordered Items</h3>
            <div className="mb-8 border-2 border-[#1e1b14] bg-white rounded-xl overflow-hidden">
              {selectedOrder.orderItems?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 border-b-2 border-[#1e1b14]/10 hover:bg-[#fff8f0]">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.product?.imgUrl}
                      alt={item.product?.title}
                      className="w-10 h-10 object-cover border-2 border-[#1e1b14] rounded-lg"
                    />
                    <div className="flex flex-col">
                      <span className="font-sans text-xs font-black uppercase text-[#1e1b14]">
                        {item.product?.title || `Product #${item.productId}`}
                      </span>
                      <span className="font-mono text-[9px] uppercase font-bold text-[#594139]">
                        {item.product?.artist} | Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#1e1b14]">
                    ${(item.priceAtTime * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="p-4 flex justify-between items-center bg-[#efe7da] border-t-2 border-[#1e1b14] text-[#1e1b14]">
                <span className="font-mono text-[10px] font-black uppercase">Total</span>
                <span className="font-sans text-lg font-black">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t-2 border-[#1e1b14]/20">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[#ab3500] hover:bg-[#ff6b35] text-white font-mono text-xs font-bold border-2 border-[#1e1b14] shadow-[3px_3px_0px_0px_#1e1b14] hover:shadow-[5px_5px_0px_0px_#1e1b14] cursor-pointer uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
