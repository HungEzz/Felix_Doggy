import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  Mail,
  RefreshCw,
  Shield,
  KeyRound,
  Heart,
} from 'lucide-react';
import { login, logout, adminLogin, updateProfile as updateReduxProfile } from '../store/userSlice';
import { removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import type { RootState } from '../store';
import toast from 'react-hot-toast';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'orders' | 'wishlist' | 'settings';

interface Order {
  id: string;
  orderCode?: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  shippingAddr: string;
  customerEmail: string;
  customerPhone: string;
  orderItems: {
    id: number;
    productId: number;
    quantity: number;
    priceAtTime: number;
    product: { id: number; title: string; artist: string; imgUrl: string; category: string };
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FormField: React.FC<{
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  suffix?: React.ReactNode;
}> = ({ label, value, onChange, type = 'text', placeholder, disabled, error, suffix }) => (
  <div>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          background: disabled ? 'var(--bg-secondary)' : 'var(--bg-card)',
          border: `1.5px solid ${error ? 'var(--warm-rose)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: suffix ? '11px 44px 11px 14px' : '11px 14px',
          fontSize: 14,
          color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          transition: 'border-color 0.2s',
          cursor: disabled ? 'not-allowed' : 'auto',
        }}
        onFocus={(e) => { if (!disabled) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={(e) => { e.target.style.borderColor = error ? 'var(--warm-rose)' : 'var(--border)'; }}
      />
      {suffix && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {suffix}
        </div>
      )}
    </div>
    {error && <p style={{ fontSize: 11, color: 'var(--warm-rose)', marginTop: 5 }}>{error}</p>}
  </div>
);

const SectionCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ children, title, subtitle, action }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
    {(title || action) && (
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          {title && <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div style={{ padding: '24px' }}>{children}</div>
  </div>
);



// ─── Tab: Profile (merged with Address) ──────────────────────────────────────

const ProfileTab: React.FC = () => {
  const dispatch = useDispatch();
  const { profile: reduxProfile } = useSelector((s: RootState) => s.user);

  const [fullName, setFullName] = useState(reduxProfile?.name || '');
  const [phone, setPhone] = useState(reduxProfile?.phone || '');
  const [address, setAddress] = useState(reduxProfile?.address || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password change states
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const handlePasswordChange = async () => {
    const e: Record<string, string> = {};
    if (!currentPw) e.currentPw = 'Enter current password';
    if (!newPw || newPw.length < 8) e.newPw = 'New password must be at least 8 characters';
    if (newPw !== confirmPw) e.confirmPw = 'Confirm password does not match';
    setPwErrors(e);
    if (Object.keys(e).length > 0) return;
    setSavingPw(true);
    try {
      await api.put('/auth/password', {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      toast.success('Password updated successfully');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPwErrors({});
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error changing password');
    } finally {
      setSavingPw(false);
    }
  };

  // Sync from Redux when profile is hydrated after login
  useEffect(() => {
    if (reduxProfile) {
      setFullName((prev) => prev || reduxProfile.name || '');
      setPhone((prev) => prev || reduxProfile.phone || '');
      setAddress((prev) => prev || reduxProfile.address || '');
    }
  }, [reduxProfile]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Please enter your name';
    if (phone && !/^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Invalid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Real API call — updates DB via PUT /api/auth/profile
      const result: any = await api.put('/auth/profile', {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      // Update Redux + localStorage so data persists across refreshes
      dispatch(
        updateReduxProfile({
          name: result.user?.fullName || fullName,
          phone: result.user?.phone || phone,
          address: result.user?.address || address,
        }),
      );

      // Persist to localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...parsed,
              name: result.user?.fullName || fullName,
              phone: result.user?.phone || phone,
              address: result.user?.address || address,
            }),
          );
        } catch {/* ignore */}
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* CSS Utility definitions for Charlie profile styling */}
      <style>{`
        .blob-frame {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            transition: all 0.3s ease;
        }
        .blob-frame:hover {
            border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
        }
        .hard-shadow {
            box-shadow: 6px 6px 0px 0px #8B9A46;
        }
        .brutalist-border {
            border: 3px solid #1e1b14;
        }
      `}</style>

      <div className="mb-6 relative inline-block">
        <h1 className="font-display text-4xl md:text-5xl text-text-primary inline-block relative z-10 uppercase font-black">
          My Profile
        </h1>
        <div className="absolute -bottom-2 -left-4 w-full h-8 bg-[#daeb8d] -z-10 blob-frame transform -rotate-2 border-2 border-text-primary"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Personal Info Form */}
        <section className="bg-card brutalist-border hard-shadow p-8 blob-frame flex flex-col gap-6 transform translate-x-2">
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">badge</span>
            <h2 className="font-display text-xl font-black text-text-primary uppercase">The Basics</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">Full Name</label>
              <input 
                className="w-full bg-[#f5ede0] brutalist-border p-3 focus:outline-none focus:ring-4 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all font-sans text-sm font-semibold" 
                style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }} 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              {errors.fullName && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">Email Address</label>
              <input 
                className="w-full bg-[#e9e2d5] brutalist-border p-3 cursor-not-allowed font-sans text-sm font-semibold opacity-70" 
                style={{ borderRadius: "15px 225px 15px 255px/255px 15px 225px 15px" }} 
                type="email" 
                disabled
                value={reduxProfile?.email || ''}
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">Phone Number</label>
              <input 
                className="w-full bg-[#f5ede0] brutalist-border p-3 focus:outline-none focus:ring-4 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all font-sans text-sm font-semibold" 
                style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }} 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.phone}</p>}
            </div>
          </div>
        </section>

        {/* Addresses */}
        <section className="flex flex-col gap-8">
          <div className="bg-card brutalist-border hard-shadow p-8 rounded-3xl flex flex-col gap-6 transform -rotate-1">
            <div className="flex items-center gap-4 mb-2">
              <span className="material-symbols-outlined text-secondary text-3xl">home</span>
              <h2 className="font-display text-xl font-black text-text-primary uppercase">Saved Addresses</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">Default Shipping Address</label>
                <textarea 
                  className="w-full bg-[#f5ede0] brutalist-border p-4 focus:outline-none focus:ring-4 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all font-sans text-sm font-semibold min-h-[100px]" 
                  style={{ borderRadius: "20px 300px 30px 250px/250px 30px 300px 20px" }} 
                  placeholder="123 ABC Street, City"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-end mt-auto">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-[#ff6b35] text-white font-display text-lg font-black py-4 px-12 brutalist-border shadow-[6px_6px_0px_0px_#8B9A46] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#8B9A46] transition-all blob-frame flex items-center gap-3 cursor-pointer uppercase"
            >
              <span className="material-symbols-outlined">{saving ? 'sync' : 'save'}</span>
              {saving ? 'Saving...' : 'Save Weirdness'}
            </button>
          </div>
        </section>
      </div>

      {/* Change Password Section */}
      <div className="mt-4 pt-4">
        <div className="bg-card brutalist-border p-8 blob-frame flex flex-col gap-6 transform -translate-x-1" style={{ boxShadow: '6px 6px 0px 0px #FF6B35' }}>
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">key</span>
            <h2 className="font-display text-xl font-black text-text-primary uppercase">Change Password</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">Current Password</label>
              <div className="relative">
                <input 
                  className="w-full bg-[#f5ede0] brutalist-border p-3 focus:outline-none focus:ring-4 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all font-sans text-sm font-semibold pr-10" 
                  style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }} 
                  type={showCurrentPw ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                />
                <button 
                  type="button" onClick={() => setShowCurrentPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary bg-transparent border-none cursor-pointer"
                >
                  {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwErrors.currentPw && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{pwErrors.currentPw}</p>}
            </div>
            <div>
              <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">New Password</label>
              <div className="relative">
                <input 
                  className="w-full bg-[#f5ede0] brutalist-border p-3 focus:outline-none focus:ring-4 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all font-sans text-sm font-semibold pr-10" 
                  style={{ borderRadius: "15px 225px 15px 255px/255px 15px 225px 15px" }} 
                  type={showNewPw ? 'text' : 'password'} 
                  placeholder="Min 8 characters"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
                <button 
                  type="button" onClick={() => setShowNewPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary bg-transparent border-none cursor-pointer"
                >
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwErrors.newPw && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{pwErrors.newPw}</p>}
            </div>
            <div>
              <label className="block font-mono text-xs font-bold mb-2 uppercase text-text-secondary">Confirm Password</label>
              <input 
                className="w-full bg-[#f5ede0] brutalist-border p-3 focus:outline-none focus:ring-4 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all font-sans text-sm font-semibold" 
                style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }} 
                type="password" 
                placeholder="••••••••"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
              />
              {pwErrors.confirmPw && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{pwErrors.confirmPw}</p>}
            </div>
          </div>
          {newPw && (
            <div className="flex gap-1 -mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded" style={{ background: newPw.length > i * 2 ? (newPw.length >= 8 ? '#8B9A46' : '#f59e0b') : '#e9e2d5', transition: 'background 0.3s' }} />
              ))}
            </div>
          )}
          <div className="flex justify-start">
            <button 
              onClick={handlePasswordChange}
              disabled={savingPw}
              className="bg-[#343027] text-white font-display text-sm font-black py-3 px-8 brutalist-border shadow-[4px_4px_0px_0px_#FF6B35] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#FF6B35] transition-all blob-frame flex items-center gap-3 cursor-pointer uppercase"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              {savingPw ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Orders ──────────────────────────────────────────────────────────────

const OrdersTab: React.FC<{ orders: Order[]; ordersLoading: boolean; onOrderCancelled: () => void }> = ({ orders, ordersLoading, onOrderCancelled }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Order Cancellation States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const handleCancelClick = (order: Order) => {
    setCancelingOrder(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelingOrder(null);
    setSelectedReason('');
    setCustomReason('');
    setCancelError('');
  };

  const handleCancelConfirm = async () => {
    if (!cancelingOrder) return;
    setIsCanceling(true);
    setCancelError('');
    try {
      const finalReason = selectedReason === "Other reason" ? customReason.trim() : selectedReason;
      
      await api.post(`/orders/cancel/${cancelingOrder.id}`, {
        cancelReason: finalReason
      });

      toast.success('Order cancelled successfully!');
      onOrderCancelled();
      closeCancelModal();
    } catch (err: any) {
      console.error('Cancel order failed:', err);
      setCancelError(err.response?.data?.message || err.message || 'Failed to cancel order');
    } finally {
      setIsCanceling(false);
    }
  };

  if (ordersLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px', background: 'var(--bg-card)', border: '4px border-text-primary', borderRadius: 'var(--radius-xl)' }} className="brutalist-border">
        <Package size={52} style={{ color: 'var(--text-muted)', marginBottom: 16 }} strokeWidth={1} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }} className="uppercase">No past obsessions yet</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Your collection is currently empty.</p>
        <button onClick={() => navigate('/bones')} className="bg-accent text-white font-display text-sm font-black py-3 px-6 brutalist-border shadow-[4px_4px_0px_0px_#1e1b14] hover:-translate-y-0.5 cursor-pointer uppercase">
          Explore items
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* local styles for wobbly order list */}
      <style>{`
        .blob-card-1 { border-radius: 255px 15px 225px 15px/15px 225px 15px 255px; }
        .blob-card-2 { border-radius: 15px 255px 15px 225px/255px 15px 225px 15px; }
        .blob-btn { border-radius: 255px 15px 225px 15px/15px 225px 15px 255px; }
        
        .hard-shadow-primary { box-shadow: 6px 6px 0px 0px #FF6B35; }
        .hard-shadow-secondary { box-shadow: 6px 6px 0px 0px #8B9A46; }
        .hard-shadow-dark { box-shadow: 6px 6px 0px 0px #1e1b14; }
        
        .drawn-divider {
            height: 4px;
            background-image: repeating-linear-gradient(45deg, #1e1b14 0, #1e1b14 2px, transparent 2px, transparent 6px);
        }
      `}</style>

      <header className="flex justify-between items-end mb-4 border-b-4 border-text-primary pb-6">
        <div>
          <h1 className="font-display text-4xl lg:text-5xl text-text-primary -rotate-1 origin-bottom-left uppercase font-black">Your Past Obsessions</h1>
          <p className="font-sans text-sm text-text-secondary mt-2">A record of your strange and wonderful acquisitions.</p>
        </div>
        <div className="hidden md:block">
          <span className="material-symbols-outlined text-6xl text-primary animate-bounce">box</span>
        </div>
      </header>

      {/* Order List Container */}
      <div className="flex flex-col gap-8">
        {orders.map((order, index) => {
          const isExpanded = expandedId === order.id;
          const displayOrderCode = order.orderCode || order.id.split('-')[0].toUpperCase();
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div key={order.id} className="w-full">
              <article className={`bg-card p-6 md:p-8 border-4 border-text-primary ${index % 2 === 0 ? 'hard-shadow-secondary blob-card-1' : 'hard-shadow-primary blob-card-2'} flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative`}>
                <div className="flex flex-col gap-2 flex-grow min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-display text-xl font-black text-primary">#{displayOrderCode}</span>
                    <span className={`font-mono text-xs border-2 border-text-primary px-3 py-1 rounded-full ${
                      order.status === 'COMPLETED' ? 'bg-[#8B9A46] text-white -rotate-2 blob-card-2' : 
                      order.status === 'CANCELLED' ? 'bg-rose-600 text-white -rotate-1 blob-card-2' : 
                      'bg-[#FF6B35] text-white rotate-2 blob-card-1'
                    }`}>{order.status}</span>
                  </div>
                  <p className="font-sans text-xs text-text-secondary font-bold">Placed on: {orderDate}</p>
                  
                  {/* Product Thumbnails inside the card */}
                  <div className="flex gap-3 mt-4">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <div key={item.id} className={`w-16 h-16 border-2 border-text-primary overflow-hidden ${idx % 2 === 0 ? 'blob-card-1' : 'blob-card-2'}`}>
                        <img className="w-full h-full object-cover" src={item.product?.imgUrl} alt={item.product?.title} />
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-16 h-16 border-2 border-text-primary overflow-hidden bg-primary flex items-center justify-center text-white font-mono text-xs font-bold blob-card-2">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col xl:items-end gap-4 border-t-4 xl:border-t-0 xl:border-l-4 border-dashed border-text-primary pt-4 xl:pt-0 xl:pl-6 w-full xl:w-auto">
                  <div className="text-left xl:text-right">
                    <p className="font-mono text-xs text-text-secondary uppercase">Total Amount</p>
                    <p className="font-display text-2xl font-black text-text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center mt-2">
                    <button 
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="font-mono text-xs text-text-primary hover:text-[#ff6b35] underline decoration-wavy underline-offset-4 decoration-2 transition-colors cursor-pointer bg-transparent border-none font-bold"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancelClick(order)}
                        className="bg-[#e74c3c] text-white font-mono text-xs font-black px-6 py-2 border-4 border-text-primary blob-btn hard-shadow-dark hover:skew-y-2 hover:scale-105 transition-all active:scale-95 cursor-pointer uppercase"
                      >
                        Cancel
                      </button>
                    )}
                    {(order.status === 'SHIPPED' || order.status === 'PROCESSING' || order.status === 'PENDING') && (
                      <button 
                        onClick={() => navigate(`/order-tracking/${displayOrderCode}`)}
                        className="bg-[#FF6B35] text-white font-mono text-xs font-black px-6 py-2 border-4 border-text-primary blob-btn hard-shadow-dark hover:skew-y-2 hover:scale-105 transition-all active:scale-95 cursor-pointer uppercase"
                      >
                        Track It
                      </button>
                    )}
                  </div>
                </div>
              </article>

              {isExpanded && (
                <div className="w-full mt-4 p-6 bg-[#fbf3e6] border-4 border-text-primary blob-card-1 hard-shadow-dark flex flex-col gap-4">
                  {(order as any).cancelReason && (
                    <div className="bg-rose-500/10 p-4 rounded-xl border-2 border-rose-500 flex items-start gap-3">
                      <span className="material-symbols-outlined text-rose-600 mt-0.5">cancel</span>
                      <div>
                        <p className="font-mono text-[10px] text-rose-600 font-bold uppercase tracking-wider">Cancellation Reason</p>
                        <p className="font-sans text-xs text-rose-700 mt-1 font-semibold">{(order as any).cancelReason}</p>
                      </div>
                    </div>
                  )}
                  {order.shippingAddr && (
                    <div className="bg-card p-4 rounded-xl border-2 border-text-primary flex items-start gap-3">
                      <span className="material-symbols-outlined text-text-secondary mt-0.5">map</span>
                      <div>
                        <p className="font-mono text-[10px] text-text-secondary font-bold uppercase tracking-wider">Shipping Address</p>
                        <p className="font-sans text-xs text-text-primary mt-1">{order.shippingAddr}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 justify-between bg-card p-3 rounded-lg border-2 border-text-primary shadow-[2px_2px_0px_0px_#1e1b14]">
                        <div className="flex items-center gap-3">
                          <img src={item.product?.imgUrl} alt={item.product?.title} className="w-12 h-12 rounded border border-text-primary object-cover flex-shrink-0" />
                          <div>
                            <p className="font-sans text-xs font-bold text-text-primary">{item.product?.title || `Product #${item.productId}`}</p>
                            <p className="font-mono text-[10px] text-text-secondary">{item.product?.artist} · Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-black text-text-primary">${(item.priceAtTime * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {index < orders.length - 1 && (
                <div className="drawn-divider w-full opacity-50 my-6"></div>
              )}
            </div>
          );
        })}
      </div>

      {showCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(30, 27, 20, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="max-w-md w-full bg-card border-4 border-text-primary rounded-xl wobbly-border-1 shadow-[8px_8px_0px_0px_rgba(30,27,20,1)] p-6" style={{ background: 'var(--bg-card)' }}>
            <h3 className="font-display text-xl font-black text-text-primary uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Why are you canceling?</h3>
            <p className="font-sans text-xs text-text-secondary mb-4" style={{ color: 'var(--text-muted)' }}>Please select a reason for canceling your order. This helps us improve our service.</p>
            
            <div className="flex flex-col gap-2 mb-6">
              {[
                "Change shipping address",
                "Change items or quantity",
                "Found better price elsewhere",
                "No longer want to buy",
                "Other reason"
              ].map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <label key={reason} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    border: isSelected ? '2px solid var(--accent)' : '2px solid var(--border)',
                    background: isSelected ? 'var(--accent-soft)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s'
                  }}>
                    <input 
                      type="radio" 
                      name="cancelReason" 
                      value={reason}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedReason(reason);
                        if (reason !== "Other reason") {
                          setCustomReason('');
                        }
                      }}
                      className="accent-[#8B9A46]"
                    />
                    <span>{reason}</span>
                  </label>
                );
              })}
            </div>

            {selectedReason === "Other reason" && (
              <textarea 
                placeholder="Please specify your reason..." 
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                maxLength={200}
                className="w-full bg-card font-sans text-sm text-text-primary border-2 border-text-primary p-3 rounded mb-6 focus:outline-none focus:border-[#ff6b35] min-h-[80px]"
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              />
            )}

            {cancelError && (
              <p className="text-xs text-rose-600 font-mono font-bold mb-4">{cancelError}</p>
            )}

            <div className="flex justify-end gap-3 font-display">
              <button 
                type="button" 
                onClick={closeCancelModal}
                disabled={isCanceling}
                className="bg-gray-200 hover:bg-gray-300 text-text-primary font-black py-2.5 px-5 border-2 border-[#343027] shadow-[2px_2px_0px_0px_#343027] cursor-pointer text-xs uppercase"
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={handleCancelConfirm}
                disabled={isCanceling || !selectedReason || (selectedReason === "Other reason" && !customReason.trim())}
                className="bg-[#e74c3c] text-white font-black py-2.5 px-5 border-2 border-[#343027] shadow-[2px_2px_0px_0px_#343027] hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer text-xs uppercase"
              >
                {isCanceling ? 'Canceling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tab: Wishlist ────────────────────────────────────────────────────────────

const WishlistTab: React.FC = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const productStocks = useSelector((s: RootState) => s.products.stock);

  const handleRemove = (id: number) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: any) => {
    const stock = productStocks[product.id] ?? product.stock;
    if (stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added ${product.title} to box`, {
      style: {
        borderRadius: '8px',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '3px solid var(--text-primary)',
      },
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px', background: 'var(--bg-card)', border: '4px solid var(--text-primary)', borderRadius: 'var(--radius-xl)' }} className="brutalist-border">
        <Heart size={52} className="text-text-muted mb-4 mx-auto animate-pulse" strokeWidth={1} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }} className="uppercase">Your Wishlist is Empty</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>You haven't liked any items yet. Start exploring!</p>
        <a href="/bones" className="inline-block bg-accent text-white font-display text-sm font-black py-3 px-6 brutalist-border shadow-[4px_4px_0px_0px_#1e1b14] hover:-translate-y-0.5 cursor-pointer uppercase no-underline">
          Explore items
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col gap-8 w-full">
      {/* CSS definitions matching the user's styling */}
      <style>{`
        .blob-frame {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            transition: all 0.3s ease;
        }
        .blob-frame:hover {
            border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
        }

        .blob-card-bg {
            clip-path: polygon(5% 0%, 100% 5%, 95% 100%, 0% 95%);
        }
        
        .blob-btn {
            border-radius: 20px 4px 20px 4px;
        }

        .wavy-underline {
            text-decoration: underline;
            text-decoration-style: wavy;
            text-decoration-color: #8B9A46;
        }
        
        .hard-shadow {
            box-shadow: 4px 4px 0px 0px rgba(30,27,20,1);
        }
        .hard-shadow-hover:hover {
            box-shadow: 6px 6px 0px 0px rgba(30,27,20,1);
            transform: translate(-2px, -2px);
        }
      `}</style>

      <div className="mb-6 relative inline-block">
        <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-on-background z-10 relative uppercase font-black">
          Your Weird Wishlist
        </h1>
        {/* Abstract decorative blob behind title */}
        <div className="absolute -bottom-2 -right-4 w-full h-4 bg-[#ff6b35]/20 -z-10 rotate-1 rounded-full"></div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {wishlistItems.map((product, index) => {
          const categoryLabel = product.category === 'dogs' ? 'Adopt a Dog' : product.category === 'food' ? 'Dog Food' : product.category === 'toys' ? 'Dog Toys' : 'Dog Clothes';
          const categoryStyle = product.category === 'dogs' 
            ? 'bg-[#8B9A46] text-white -rotate-2' 
            : product.category === 'food' 
            ? 'bg-[#ff6b35]/20 text-[#ff6b35] rotate-3' 
            : 'bg-[#8B9A46]/20 text-[#8B9A46] -rotate-1';
          
          // Alternating rotate classes for brutalist aesthetics
          const rotateClass = index % 3 === 0 
            ? 'hover:rotate-1' 
            : index % 3 === 1 
            ? 'hover:-rotate-1' 
            : 'hover:rotate-2';

          return (
            <div 
              key={product.id} 
              className={`relative bg-[#F5EDE0] border-4 border-[#1e1b14] p-6 blob-card-bg hard-shadow transition-transform hover:-translate-y-1 ${rotateClass} group flex flex-col justify-between`}
            >
              {/* Close Button */}
              <button 
                onClick={() => handleRemove(product.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#F5EDE0] rounded-full border-2 border-[#1e1b14] flex items-center justify-center hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Product Image within Blob Frame */}
              <div className="w-full h-48 mb-6 overflow-hidden border-2 border-[#1e1b14] blob-frame bg-[#F5EDE0] flex items-center justify-center p-4">
                <img 
                  className="max-h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" 
                  alt={product.title} 
                  src={product.imgUrl} 
                />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2 flex-grow">
                <div className={`inline-block font-mono text-[10px] font-bold px-3 py-1 rounded-full border-2 border-[#1e1b14] self-start uppercase ${categoryStyle}`}>
                  {categoryLabel}
                </div>
                <h3 className="font-headline-md text-headline-md text-[#1e1b14] mt-2 font-black uppercase line-clamp-2">
                  {product.title}
                </h3>
                <p className="font-mono text-xs text-text-secondary -mt-1 font-bold">
                  {product.artist}
                </p>
                <p className="font-body-lg text-body-lg text-[#8B9A46] font-extrabold mt-auto pt-2">
                  ${product.price.toFixed(2)}
                </p>
                
                {/* Add to Box Button */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full bg-[#ff6b35] text-white font-mono text-xs font-black py-3 px-4 border-2 border-[#1e1b14] hard-shadow hard-shadow-hover blob-btn transition-all flex justify-center items-center gap-2 cursor-pointer uppercase"
                >
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                  Add to Box
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Tab: Settings ────────────────────────────────────────────────────────────

const SettingsTab: React.FC = () => {
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </button>
  );

  return (
    <SectionCard title="Account Settings" subtitle="Customize your experience">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { label: 'Order Notifications', desc: 'Receive notifications about order statuses', value: notifyOrders, onChange: setNotifyOrders },
          { label: 'Promotions & Offers', desc: 'Receive emails about new products and special offers', value: notifyPromos, onChange: setNotifyPromos },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 0', borderBottom: i < 1 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <Toggle value={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

// ─── OTP Verification Component ───────────────────────────────────────────────

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}${'*'.repeat(Math.min(local.length - 2, 6))}@${domain}`;
};

const OtpVerification: React.FC<{
  email: string;
  onVerified: (data: { token: string; user: any }) => void;
  onBack: () => void;
}> = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    setVerifying(true);
    setError('');
    try {
      const res: any = await api.post('/auth/verify-otp', { email, code });
      toast.success('Verification successful!');
      onVerified({ token: res.token, user: res.user });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Incorrect OTP code');
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('A new OTP code has been sent');
      setCountdown(60);
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every((d) => d !== '') && otp.join('').length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(139,92,246,0.1) 100%)',
            border: '2px solid rgba(29,185,84,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Shield size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)', marginBottom: 8 }}>
            Email Verification
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            We have sent a 6-digit verification code to
          </p>
          <p style={{
            fontSize: 14, fontWeight: 700, color: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4,
          }}>
            <Mail size={14} /> {maskEmail(email)}
          </p>
        </div>

        {/* OTP Inputs */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              style={{
                width: 50, height: 58,
                textAlign: 'center',
                fontSize: 22, fontWeight: 800,
                fontFamily: "'Courier New', monospace",
                color: 'var(--text-primary)',
                background: digit ? 'rgba(29,185,84,0.06)' : 'var(--bg-card)',
                border: `2px solid ${error ? 'var(--warm-rose)' : digit ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                outline: 'none',
                transition: 'all 0.2s',
                caretColor: 'var(--accent)',
              }}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', marginBottom: 16,
            background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: 'var(--radius-md)',
          }}>
            <AlertCircle size={14} style={{ color: 'var(--warm-rose)', flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: 'var(--warm-rose)', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={verifying || otp.some((d) => !d)}
          style={{
            width: '100%', padding: '14px',
            background: otp.every((d) => d) ? 'var(--accent)' : 'var(--border)',
            color: otp.every((d) => d) ? '#000' : 'var(--text-muted)',
            border: 'none', borderRadius: 'var(--radius-full)',
            fontSize: 14, fontWeight: 700,
            cursor: verifying || otp.some((d) => !d) ? 'not-allowed' : 'pointer',
            opacity: verifying ? 0.7 : 1,
            fontFamily: 'var(--font-sans)',
            boxShadow: otp.every((d) => d) ? 'var(--shadow-accent)' : 'none',
            transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {verifying ? (
            <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</>
          ) : (
            <><CheckCircle size={14} /> Confirm</>
          )}
        </button>

        {/* Resend */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          {countdown > 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Resend code in <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
                {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: 'var(--accent)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                opacity: resending ? 0.6 : 1,
              }}
            >
              <RefreshCw size={13} style={resending ? { animation: 'spin 1s linear infinite' } : undefined} />
              {resending ? 'Sending...' : 'Resend OTP code'}
            </button>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onBack}
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            ← Back to login
          </button>
        </div>

        {/* Spin animation */}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

// ─── Forgot Password Flow ─────────────────────────────────────────────────────

type ForgotStep = 'email' | 'otp' | 'newPassword';

const ForgotPasswordFlow: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState<ForgotStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP code has been sent to your email');
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP → go to new password step
  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    setError('');
    setStep('newPassword');
  };

  // Auto-advance when all OTP digits entered
  useEffect(() => {
    if (step === 'otp' && otp.every((d) => d !== '') && otp.join('').length === 6) {
      handleVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  // Resend OTP
  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('A new OTP code has been sent');
      setCountdown(60);
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Confirm password does not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/auth/reset-password', {
        email,
        code: otp.join(''),
        newPassword,
      });
      toast.success('Password reset successfully! Please log in.');
      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Step configs
  const stepConfig = {
    email: { icon: <Mail size={28} />, title: 'Forgot Password', subtitle: 'Enter your registered email to receive a verification code' },
    otp: { icon: <Shield size={28} />, title: 'Enter OTP', subtitle: `We have sent a 6-digit code to ${maskEmail(email)}` },
    newPassword: { icon: <KeyRound size={28} />, title: 'Create New Password', subtitle: 'Enter a new password for your account' },
  };

  const cfg = stepConfig[step];

  return (
    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(231,76,60,0.15) 0%, rgba(192,57,43,0.1) 100%)',
            border: '2px solid rgba(231,76,60,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ color: '#e74c3c' }}>{cfg.icon}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)', marginBottom: 8 }}>
            {cfg.title}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {cfg.subtitle}
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
            {(['email', 'otp', 'newPassword'] as ForgotStep[]).map((s, i) => (
              <div key={s} style={{
                width: step === s ? 28 : 8, height: 8,
                borderRadius: 4,
                background: step === s ? '#e74c3c' : i < ['email', 'otp', 'newPassword'].indexOf(step) ? '#e74c3c' : 'var(--border)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Email" value={email} onChange={setEmail} type="email" placeholder="email@example.com" />
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                <AlertCircle size={14} style={{ color: 'var(--warm-rose)', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--warm-rose)', fontWeight: 500 }}>{error}</p>
              </div>
            )}
            <button type="submit" disabled={submitting} style={{
              marginTop: 4, width: '100%', padding: '14px',
              background: '#e74c3c', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontSize: 14, fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {submitting ? (
                <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
              ) : (
                <><Mail size={14} /> Send verification code</>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  style={{
                    width: 50, height: 58,
                    textAlign: 'center',
                    fontSize: 22, fontWeight: 800,
                    fontFamily: "'Courier New', monospace",
                    color: 'var(--text-primary)',
                    background: digit ? 'rgba(231,76,60,0.06)' : 'var(--bg-card)',
                    border: `2px solid ${error ? 'var(--warm-rose)' : digit ? '#e74c3c' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    caretColor: '#e74c3c',
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                <AlertCircle size={14} style={{ color: 'var(--warm-rose)', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--warm-rose)', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={otp.some((d) => !d)}
              style={{
                width: '100%', padding: '14px',
                background: otp.every((d) => d) ? '#e74c3c' : 'var(--border)',
                color: otp.every((d) => d) ? '#fff' : 'var(--text-muted)',
                border: 'none', borderRadius: 'var(--radius-full)',
                fontSize: 14, fontWeight: 700,
                cursor: otp.some((d) => !d) ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <CheckCircle size={14} /> Continue
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              {countdown > 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Resend code in <span style={{ color: '#e74c3c', fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
                    {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 600, color: '#e74c3c',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    opacity: resending ? 0.6 : 1,
                  }}
                >
                  <RefreshCw size={13} style={resending ? { animation: 'spin 1s linear infinite' } : undefined} />
                  {resending ? 'Sending...' : 'Resend OTP code'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: New password */}
        {step === 'newPassword' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              type={showPw ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              suffix={
                <button type="button" onClick={() => setShowPw((s) => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <FormField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              placeholder="••••••••"
            />

            {newPassword && (
              <div style={{ display: 'flex', gap: 4, marginTop: -8 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: newPassword.length > i * 2 ? (newPassword.length >= 8 ? '#e74c3c' : '#f59e0b') : 'var(--border)', transition: 'background 0.3s' }} />
                ))}
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                <AlertCircle size={14} style={{ color: 'var(--warm-rose)', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--warm-rose)', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={submitting} style={{
              marginTop: 4, width: '100%', padding: '14px',
              background: '#e74c3c', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-full)',
              fontSize: 14, fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {submitting ? (
                <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
              ) : (
                <><KeyRound size={14} /> Reset password</>
              )}
            </button>
          </form>
        )}

        {/* Back to login */}
        <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={step === 'otp' ? () => { setStep('email'); setError(''); } : onBack}
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            {step === 'otp' ? '← Change email' : '← Back to login'}
          </button>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // OTP step
  const [otpStep, setOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  // Forgot password step
  const [forgotStep, setForgotStep] = useState(false);

  const handleRedirect = () => {
    const from = (location.state as any)?.from?.pathname || searchParams.get('redirect');
    if (from) {
      navigate(from);
    }
  };

  const handleGoogleLogin = async (googleResponse: any) => {
    setSubmitting(true);
    try {
      const res: any = await api.post('/auth/google', { token: googleResponse.credential });
      const u = res.user;
      const profileData = {
        id: u.id,
        name: u.fullName || 'Customer',
        email: u.email,
        phone: u.phone || '',
        address: u.address || '',
        role: u.role,
      };

      if (u.role?.toUpperCase() === 'ADMIN') {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify(profileData));
        dispatch(adminLogin(profileData));
        toast.success('Admin login successful');
        navigate('/admin');
      } else {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(profileData));
        dispatch(login(profileData));
        toast.success('Login successful');
        handleRedirect();
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (otpStep || forgotStep) return;

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not configured.');
      return;
    }

    const initGoogleGsi = () => {
      const g = (window as any).google;
      if (g && g.accounts && g.accounts.id) {
        g.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLogin,
        });

        const btnContainer = document.getElementById('google-signin-button');
        if (btnContainer) {
          g.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 372,
            shape: 'circle',
          });
        }
        g.accounts.id.prompt(); // One Tap
      } else {
        setTimeout(initGoogleGsi, 200);
      }
    };

    initGoogleGsi();
  }, [isLogin, otpStep, forgotStep]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin) {
      if (!firstName.trim()) e.firstName = 'Enter first name';
      if (!lastName.trim()) e.lastName = 'Enter last name';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address';
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const fullName = isLogin ? '' : (firstName.trim() + ' ' + lastName.trim()).trim();
    try {
      if (isLogin) {
        const res: any = await api.post('/auth/login', { email, password });
        const u = res.user;
        const profileData = {
          id: u.id,
          name: u.fullName || 'Customer',
          email: u.email,
          phone: u.phone || '',
          address: u.address || '',
          role: u.role,
        };

        if (u.role?.toUpperCase() === 'ADMIN') {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_user', JSON.stringify(profileData));
          dispatch(adminLogin(profileData));
          toast.success('Admin login successful');
          navigate('/admin');
        } else {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(profileData));
          dispatch(login(profileData));
          toast.success('Login successful');
          handleRedirect();
        }
      } else {
        await api.post('/auth/register', { email, password, fullName });
        toast.success('Please check your email to retrieve the OTP code!');
        setOtpEmail(email);
        setOtpStep(true);
      }
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.requireOtp) {
        const unverifiedEmail = error.response.data.email || email;
        toast('Account not verified. Please enter your OTP code.', { icon: '🔒' });
        setOtpEmail(unverifiedEmail);
        setOtpStep(true);
        try {
          await api.post('/auth/resend-otp', { email: unverifiedEmail });
          toast.success('OTP code has been sent to your email');
        } catch {
          // silently fail
        }
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (forgotStep) {
    return <ForgotPasswordFlow onBack={() => { setForgotStep(false); setIsLogin(true); }} />;
  }

  if (otpStep) {
    return (
      <OtpVerification
        email={otpEmail}
        onVerified={({ token: t, user: u }) => {
          const profileData = {
            id: u.id,
            name: u.fullName || 'Customer',
            email: u.email,
            phone: u.phone || '',
            address: u.address || '',
            role: u.role,
          };
          if (u.role?.toUpperCase() === 'ADMIN') {
            localStorage.setItem('admin_token', t);
            localStorage.setItem('admin_user', JSON.stringify(profileData));
            dispatch(adminLogin(profileData));
            navigate('/admin');
          } else {
            localStorage.setItem('token', t);
            localStorage.setItem('user', JSON.stringify(profileData));
            dispatch(login(profileData));
            handleRedirect();
          }
        }}
        onBack={() => {
          setOtpStep(false);
          setIsLogin(true);
        }}
      />
    );
  }

  return (
    <main className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto md:p-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Local Styles for Auth Blobs */}
      <style>{`
        .rounded-blob {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .rounded-blob-alt {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .blob-shadow-olive {
            box-shadow: 6px 6px 0px 0px #8B9A46;
        }
        .blob-shadow-orange {
            box-shadow: 6px 6px 0px 0px #FF6B35;
        }
        .input-blob {
            border: 3px solid var(--text-primary);
            border-radius: 15px 30px 15px 30px / 30px 15px 30px 15px;
            transition: all 0.2s ease;
        }
        .input-blob:focus {
            outline: none;
            border-color: #FF6B35;
            box-shadow: 4px 4px 0px 0px rgba(255, 107, 53, 0.25);
        }
      `}</style>

      {/* Left Panel: Illustration */}
      <section className="hidden md:flex flex-1 flex-col items-center justify-center p-8 relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <span className="material-symbols-outlined absolute top-10 left-10 text-6xl text-[#8B9A46] transform -rotate-12">cruelty_free</span>
          <span className="material-symbols-outlined absolute bottom-20 right-20 text-5xl text-outline transform rotate-45">pets</span>
        </div>
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary tracking-tight leading-tight uppercase font-black">
            Log in to keep your weird ones fed.
          </h1>
          <div className="relative w-full aspect-square max-w-[340px] mx-auto group">
            <div className="absolute inset-0 bg-[#8B9A46] rounded-blob-alt blob-shadow-olive transform group-hover:rotate-3 transition-transform duration-500 z-0 mt-4 ml-4"></div>
            <div className="relative w-full h-full rounded-blob overflow-hidden border-4 border-text-primary z-10 bg-secondary transform group-hover:-rotate-2 transition-transform duration-500">
              <img className="w-full h-full object-cover" 
                alt="A goofy cross-eyed dog" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyK0RSEyP40H53XfHAT4Pfra5WEwchci7E7P1nIup2JptFJyd1AA3ZHtF4WDnHgchy6OXdIHe3OCrZz0trGJ3LD90smFHEelH96t-OICidMqOt3DHNpzVji7h4c9AH2cixXHFnaHMABtX3kg1ZIqYamPPu-Pxz6b_qfmsHusp8rlCRjHObB2h5ZMQQF5OjxeuTcjuP2NYCFIRz1T5Ym-K0zFnmaO4GKdMVhyglGxszYAQkrBdTe8jTE_iHt5FFNK7MhAkkNP14J0s" />
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Auth Forms */}
      <section className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-md bg-card border-4 border-text-primary blob-shadow-olive rounded-[2rem] p-8 md:p-10 relative">
          
          {/* Logo Mobile only */}
          <div className="md:hidden text-center mb-8">
            <span className="font-display text-2xl font-black text-accent uppercase">Felix Doggy</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b-4 border-text-primary mb-8 relative">
            <button 
              className={`flex-1 py-4 font-display text-xl font-black transition-colors cursor-pointer ${
                isLogin ? 'text-accent border-b-4 border-accent -mb-[4px] z-10' : 'text-text-secondary hover:text-accent border-b-4 border-transparent -mb-[4px]'
              }`}
              id="tab-login" 
              onClick={() => { setIsLogin(true); setErrors({}); }}
            >
              Log In
            </button>
            <button 
              className={`flex-1 py-4 font-display text-xl font-black transition-colors cursor-pointer ${
                !isLogin ? 'text-accent border-b-4 border-accent -mb-[4px] z-10' : 'text-text-secondary hover:text-accent border-b-4 border-transparent -mb-[4px]'
              }`}
              id="tab-signup" 
              onClick={() => { setIsLogin(false); setErrors({}); }}
            >
              Sign Up
            </button>
          </div>

          {/* Google Auth Button */}
          <div className="w-full flex justify-center mb-6">
            <div id="google-signin-button" className="w-full flex justify-center"></div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] bg-text-secondary/20 flex-1"></div>
            <span className="font-mono text-xs font-bold text-text-secondary uppercase">or use email</span>
            <div className="h-[2px] bg-text-secondary/20 flex-1"></div>
          </div>

          {/* Forms */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              // Login Form
              <>
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold block text-text-primary uppercase" htmlFor="login-email">Email Address</label>
                  <input 
                    className="w-full bg-card input-blob px-4 py-3 text-text-primary placeholder:text-text-muted" 
                    id="login-email" 
                    placeholder="weirdo@example.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold block text-text-primary uppercase" htmlFor="login-password">Password</label>
                  <input 
                    className="w-full bg-card input-blob px-4 py-3 text-text-primary placeholder:text-text-muted" 
                    id="login-password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.password}</p>}
                </div>
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={() => setForgotStep(true)}
                    className="font-mono text-xs font-bold text-accent hover:underline cursor-pointer"
                  >
                    Forgot your weirdness?
                  </button>
                </div>
                <button 
                  className="w-full bg-accent text-text-primary font-display text-lg font-black py-4 px-6 rounded-blob border-2 border-text-primary shadow-[4px_4px_0px_0px_#1e1b14] hover:-translate-y-1 hover:rotate-1 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Entering...' : 'Enter the Den'}
                  <span className="material-symbols-outlined">pets</span>
                </button>
                <p className="text-center font-mono text-xs text-text-secondary mt-4">
                  New here? <button type="button" className="text-accent underline font-bold cursor-pointer" onClick={() => setIsLogin(false)}>Sign up</button>
                </p>
              </>
            ) : (
              // Signup Form
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold block text-text-primary uppercase" htmlFor="signup-fn">First Name</label>
                    <input 
                      className="w-full bg-card input-blob px-4 py-3 text-text-primary placeholder:text-text-muted" 
                      id="signup-fn" 
                      placeholder="Weirdo" 
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {errors.firstName && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold block text-text-primary uppercase" htmlFor="signup-ln">Last Name</label>
                    <input 
                      className="w-full bg-card input-blob px-4 py-3 text-text-primary placeholder:text-text-muted" 
                      id="signup-ln" 
                      placeholder="Pal" 
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {errors.lastName && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold block text-text-primary uppercase" htmlFor="signup-email">Email Address</label>
                  <input 
                    className="w-full bg-card input-blob px-4 py-3 text-text-primary placeholder:text-text-muted" 
                    id="signup-email" 
                    placeholder="weirdo@example.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold block text-text-primary uppercase" htmlFor="signup-password">Password</label>
                  <input 
                    className="w-full bg-card input-blob px-4 py-3 text-text-primary placeholder:text-text-muted" 
                    id="signup-password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <p className="text-xs text-rose-600 font-mono font-bold mt-1">{errors.password}</p>}
                </div>
                
                <button 
                  className="w-full bg-accent text-text-primary font-display text-lg font-black py-4 px-6 rounded-blob border-2 border-text-primary shadow-[4px_4px_0px_0px_#1e1b14] hover:-translate-y-1 hover:-rotate-1 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Joining...' : 'Join the Weirdos'}
                  <span className="material-symbols-outlined">celebration</span>
                </button>
                <p className="text-center font-mono text-xs text-text-secondary mt-4">
                  Already a weirdo? <button type="button" className="text-accent underline font-bold cursor-pointer" onClick={() => setIsLogin(true)}>Log in</button>
                </p>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

// ─── Main User Page ───────────────────────────────────────────────────────────

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ReactNode }[] = [
  { tab: 'profile',   label: 'Profile',      icon: <UserIcon size={17} /> },
  { tab: 'orders',    label: 'Orders',       icon: <Package size={17} /> },
  { tab: 'wishlist',  label: 'Wishlist',     icon: <Heart size={17} /> },
  { tab: 'settings',  label: 'Settings',     icon: <Settings size={17} /> },
];

const User: React.FC = () => {
  const { isLoggedIn, profile: reduxProfile } = useSelector((s: RootState) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab') as Tab | null;
  const [tab, setTabState] = useState<Tab>(urlTab || 'profile');

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const setTab = (t: Tab) => {
    setTabState(t);
    navigate(`/account?tab=${t}`, { replace: true });
  };

  useEffect(() => {
    if (urlTab && urlTab !== tab) setTabState(urlTab);
  }, [urlTab]);

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn) return;
    setOrdersLoading(true);
    try {
      const data = (await api.get('/orders/my-orders')) as Order[];
      setOrders(data);
    } catch {
      // silently fail
    } finally {
      setOrdersLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchOrders();
    else setOrders([]);
  }, [isLoggedIn, fetchOrders]);

  if (!isLoggedIn || !reduxProfile) return <AuthPage />;

  const pendingCount = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'PROCESSING',
  ).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const avatarUrl = tab === 'orders'
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDPE7x7f1JQ39l3av61lc5UtmbQtxuKZURHziWfQUuCUUbqptIx9nX4axGDP58vAe_bM0x_30PNS7DZic-I2VT5rn08jrsRI9R4ASbGYrlpoOyX1SdKOoagO3i_YQG63iNjXlKsxkn6uJF0T_2GOVCJU-Na3VY_H8c-HFJgGeYqtpxyAMzOnGRHzF2DlQSSqPfUF_gO-l_lns04SgiAfY6eBEXIXtrVrZHdygCahLhM-xdi9kwVm9liH3TWUGHptaB2R3mRcd_pw1Y"
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuDWeB_ksa98cu9wM6F5HhhlSwVzpLKw9eO5MoMz2CbcXVimtpm8CA6zymV7GNPMVFHjOUZ5UsPqEuRV5OyP5evbKer0Ee0BwmNtJrzHXoeM_uYB2wYKF9lS7XNXJSe2CCw0k1ChvO4I0eIH8Q64Hm0xKx6ireDjUnNWU7QWgyxEyk9xIbRMftCcQ-PovMtgB64qj182zQrC6Gont8VX3cPcgxyXUk4sGpa2tZuvlsCLutsHf8lccUiINsWqenbEjAroRBC49S31kG4";

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', flexGrow: 1 }}>
      
      {/* local styles for Charlie account page layout */}
      <style>{`
        .blob-frame {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            transition: all 0.3s ease;
        }
        .blob-frame:hover {
            border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
        }
        .brutalist-border {
            border: 3px solid #1e1b14;
        }
      `}</style>

      <div className="container-main" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="user-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>
          
          {/* SideNavBar */}
          <aside className="user-sidebar p-6 bg-card rounded-xl border-4 border-text-primary shadow-[8px_8px_0px_0px_#8B9A46] sticky top-28 w-64 flex flex-col gap-6 text-center">
            
            <div className="flex flex-col items-center mb-4">
              <div className="w-32 h-32 blob-frame brutalist-border overflow-hidden mb-4 bg-secondary-container">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Charlie the Human avatar" 
                  src={avatarUrl} 
                />
              </div>
              <h2 className="font-display text-lg font-black text-primary mb-1 uppercase leading-tight overflow-hidden text-ellipsis w-full whitespace-nowrap">{reduxProfile.name || 'Charlie the Human'}</h2>
              <span className="font-mono text-xs bg-secondary text-white px-3 py-1 rounded-full blob-frame">Weirdo since Oct 2023</span>
              {reduxProfile?.role?.toUpperCase() === 'ADMIN' && (
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => window.open('/admin', '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', border: '1px solid rgba(29,185,84,0.3)', borderRadius: 'var(--radius-full)', padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    <LayoutDashboard size={11} /> Admin Panel
                  </button>
                </div>
              )}
            </div>

            <nav className="flex flex-col gap-3 font-mono text-xs flex-1">
              {NAV_ITEMS.map((item) => {
                const isActive = tab === item.tab;
                return (
                  <button 
                    key={item.tab} 
                    onClick={() => setTab(item.tab)}
                    className={`w-full border-2 px-4 py-3 flex items-center gap-3 hover:skew-x-2 transition-all active:scale-95 text-left cursor-pointer font-bold rounded-full ${
                      isActive 
                        ? 'bg-accent text-white border-text-primary shadow-[2px_2px_0px_0px_rgba(30,27,20,1)]' 
                        : 'text-text-primary border-transparent hover:bg-[#daeb8d]/30 hover:text-text-primary'
                    }`}
                  >
                    <span className="flex shrink-0">{item.icon}</span>
                    <span className="flex-1 uppercase">{item.label}</span>
                    {item.tab === 'orders' && pendingCount > 0 && (
                      <span style={{ background: 'var(--accent)', color: '#000', borderRadius: '50%', padding: '2px 8px', fontSize: 10, fontWeight: 800 }}>{pendingCount}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-text-secondary/20">
              <button 
                onClick={handleLogout}
                className="w-full text-text-primary hover:bg-rose-500/20 hover:text-rose-600 rounded-full px-4 py-3 transition-all flex items-center gap-3 hover:skew-x-2 active:scale-95 font-mono text-xs font-black border-2 border-transparent hover:border-text-primary cursor-pointer uppercase"
              >
                <LogOut size={14} className="flex shrink-0" />
                Log Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ minWidth: 0 }}>
            {tab === 'profile'  && <ProfileTab />}
            {tab === 'orders'   && <OrdersTab orders={orders} ordersLoading={ordersLoading} onOrderCancelled={fetchOrders} />}
            {tab === 'wishlist' && <WishlistTab />}
            {tab === 'settings' && <SettingsTab />}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .user-layout {
            grid-template-columns: 1fr !important;
          }
          .user-sidebar {
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          .user-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .user-actions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .user-profile-grid {
            grid-template-columns: 1fr !important;
          }
          .otp-input-group {
            gap: 6px !important;
          }
          .otp-input-group input {
            width: 42px !important;
            height: 50px !important;
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default User;