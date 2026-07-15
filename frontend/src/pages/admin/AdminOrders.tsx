import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  return (
    <div className="space-y-6">
      <div className="pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Order Management</h1>
        <p className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Track and update order status</p>
      </div>

      <div className="overflow-x-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <th className="p-5 font-bold">Order ID</th>
              <th className="p-5 font-bold">Customer</th>
              <th className="p-5 font-bold">Date Placed</th>
              <th className="p-5 font-bold">Total Price</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 font-bold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {orders.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td 
                  className="p-5 font-bold cursor-pointer transition-colors" 
                  title="Click to copy full order ID"
                  onClick={() => {
                    navigator.clipboard.writeText(item.id);
                    toast.success('Full order ID copied!');
                  }}
                >
                  #{item.id.substring(0, 8)}...
                </td>
                <td className="p-5">
                  <p className="font-bold mb-1">{item.user?.fullName || 'Guest'}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{item.customerEmail}</p>
                </td>
                <td className="p-5">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="p-5 font-bold">${item.totalAmount.toFixed(2)}</td>
                <td className="p-5">
                  <select 
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="bg-transparent p-2 text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => setSelectedOrder(item)} className="inline-flex transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-sm p-5 text-center" style={{ color: 'var(--text-secondary)' }}>No orders yet.</p>}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="p-4 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 pb-4" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>
              Order Details #{selectedOrder.id.substring(0, 8)}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm mb-8 p-4 sm:p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Customer</p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.user?.fullName || 'Guest'}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customerEmail}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customerPhone || 'No phone number'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Shipping Address</p>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{selectedOrder.shippingAddr || 'No shipping address'}</p>
              </div>
            </div>
            
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>Ordered Items</h3>
            <div className="mb-8" style={{ border: '1px solid var(--border)' }}>
              {selectedOrder.orderItems?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 text-sm" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  <div className="flex gap-4 items-center">
                    <img src={item.product?.imgUrl} alt={item.product?.title} className="w-10 h-10 object-cover" style={{ border: '1px solid var(--border)' }} />
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-wider text-[11px]">{item.product?.title || `Product #${item.productId}`}</span>
                      <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>{item.product?.artist} | QUANTITY: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold">${(item.priceAtTime * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="p-4 flex justify-between items-center" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <span className="font-bold uppercase tracking-widest text-[11px]">Total</span>
                <span className="font-bold text-lg">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setSelectedOrder(null)} className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors" style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}>
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
