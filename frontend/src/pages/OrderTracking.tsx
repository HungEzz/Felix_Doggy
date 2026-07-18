import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtTime: number;
  product: { id: number; title: string; artist: string; imgUrl: string; category: string };
}

interface Order {
  id: string;
  orderCode: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  shippingAddr: string;
  customerEmail: string;
  customerPhone: string;
  orderItems: OrderItem[];
  cancelReason?: string | null;
}

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useSelector((s: RootState) => s.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // States for Guest lookup
  const [guestIdInput, setGuestIdInput] = useState('');
  const [contactInput, setContactInput] = useState(location.state?.contact || '');
  const [guestOrder, setGuestOrder] = useState<Order | null>(location.state?.guestOrder || null);
  const [trackingError, setTrackingError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const data = (await api.get('/orders/my-orders')) as Order[];
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Public order lookup logic
  const verifyGuestOrder = async (targetId: string, contact: string) => {
    setIsVerifying(true);
    setTrackingError('');
    try {
      const data = (await api.get(`/orders/track/${targetId}?contact=${encodeURIComponent(contact.trim())}`)) as Order;
      setGuestOrder(data);
      setTrackingError('');
      return data;
    } catch (err: any) {
      console.error('Guest tracking failed:', err);
      setTrackingError(err.response?.data?.message || 'Invalid Order ID or email/phone.');
      setGuestOrder(null);
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!contactInput.trim()) {
      setTrackingError('Please enter the email or phone number used for this order.');
      return;
    }
    try {
      await verifyGuestOrder(id, contactInput);
    } catch {
      // Error is handled in verifyGuestOrder
    }
  };

  const handleGuestSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestIdInput.trim()) {
      setTrackingError('Please enter an Order ID.');
      return;
    }
    if (!contactInput.trim()) {
      setTrackingError('Please enter your email or phone.');
      return;
    }
    try {
      const data = await verifyGuestOrder(guestIdInput.trim(), contactInput);
      navigate(`/order-tracking/${guestIdInput.trim()}`, {
        state: { guestOrder: data, contact: contactInput }
      });
    } catch {
      // Error is handled in verifyGuestOrder
    }
  };

  const orderData = useMemo(() => {
    if (isLoggedIn) {
      if (!id || orders.length === 0) return null;
      return orders.find(
        (o) =>
          o.id === id ||
          String(o.orderCode) === id ||
          o.id.toLowerCase().startsWith(id.toLowerCase()),
      );
    } else {
      if (!id || !guestOrder) return null;
      const isMatch =
        guestOrder.id === id ||
        String(guestOrder.orderCode) === id ||
        guestOrder.id.toLowerCase().startsWith(id.toLowerCase());
      return isMatch ? guestOrder : null;
    }
  }, [id, orders, guestOrder, isLoggedIn]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/order-tracking/${searchInput.trim()}`);
    }
  };

  // Order Cancellation States & Handlers
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedReason('');
    setCustomReason('');
    setCancelError('');
  };

  const handleCancelConfirm = async () => {
    if (!orderData) return;
    setIsCanceling(true);
    setCancelError('');
    try {
      const finalReason = selectedReason === "Other reason" ? customReason.trim() : selectedReason;
      const contactVal = orderData.customerEmail || orderData.customerPhone || '';

      const res: any = await api.post(`/orders/cancel/${orderData.id}`, {
        contact: contactVal || undefined,
        cancelReason: finalReason
      });

      toast.success('Order cancelled successfully!');
      
      if (isLoggedIn) {
        await fetchOrders();
      } else {
        setGuestOrder(res.order);
      }
      closeCancelModal();
    } catch (err: any) {
      console.error('Cancel order failed:', err);
      setCancelError(err.response?.data?.message || err.message || 'Failed to cancel order');
    } finally {
      setIsCanceling(false);
    }
  };

  // Determine stage progress
  const getStatusStep = () => {
    if (!orderData) return 0;
    const status = orderData.status;
    if (status === 'CANCELLED') return -1;
    if (status === 'COMPLETED') return 4;
    if (status === 'SHIPPED') return 3;
    if (status === 'PROCESSING') return 2;
    return 1; // PENDING
  };

  const activeStep = getStatusStep();
  const highlightedLineWidth =
    activeStep === 4 ? '100%' 
    : activeStep === 3 ? '75%' 
    : activeStep === 2 ? '50%' 
    : activeStep === 1 ? '25%' 
    : '0%';

  // Date helpers
  const orderDateStr = orderData?.createdAt
    ? new Date(orderData.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const estDate = orderData?.createdAt
    ? new Date(
        new Date(orderData.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '3–5 days';

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="font-display text-xl font-black text-text-primary uppercase animate-pulse">Loading tracking details...</div>
      </div>
    );
  }

  // Case 1: If there is an ID in the URL, but orderData is not yet verified/loaded
  if (id && !orderData) {
    if (isLoggedIn) {
      return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
          <div className="max-w-md w-full text-center py-16 bg-card border-4 border-text-primary rounded-xl wobbly-border-1 shadow-[6px_6px_0px_0px_rgba(30,27,20,1)] px-8">
            <span className="material-symbols-outlined text-6xl text-rose-600 mb-4">warning</span>
            <h2 className="font-display text-2xl font-black text-text-primary uppercase mb-2">Order Not Found</h2>
            <p className="font-sans text-sm text-text-secondary mb-6">We couldn't find an order matching #{id} in your account.</p>
            <Link to="/order-tracking">
              <button className="bg-[#ff6b35] text-white font-display font-black py-4 px-6 border-3 border-[#343027] shadow-[4px_4px_0px_0px_#343027] hover:-translate-y-0.5 cursor-pointer uppercase text-sm">Back to Tracking</button>
            </Link>
          </div>
        </div>
      );
    }

    // Guest user verification required
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div className="max-w-md w-full text-center py-16 bg-card border-4 border-text-primary rounded-xl wobbly-border-1 shadow-[6px_6px_0px_0px_rgba(30,27,20,1)] px-8">
          <span className="material-symbols-outlined text-6xl text-[#ff6b35] mb-4">verified_user</span>
          <h2 className="font-display text-2xl font-black text-text-primary uppercase mb-2">Verify Order</h2>
          <p className="font-sans text-sm text-text-secondary mb-6">For security, please enter the email or phone number used during checkout to track Order #{id}.</p>
          <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Email or Phone Number" 
              value={contactInput}
              onChange={e => setContactInput(e.target.value)}
              className="bg-card font-mono text-sm text-text-primary border-3 border-text-primary p-3 rounded focus:outline-none focus:border-[#ff6b35] text-center font-bold"
            />
            <button 
              type="submit" 
              disabled={isVerifying}
              className="bg-[#ff6b35] text-white font-display font-black py-4 px-6 border-3 border-[#343027] shadow-[4px_4px_0px_0px_#343027] hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer uppercase text-sm"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Track'}
            </button>
          </form>
          {trackingError && (
            <p className="text-xs text-rose-600 font-mono font-bold mt-4">{trackingError}</p>
          )}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-text-secondary/20">
            <Link to="/account" className="font-mono text-xs font-bold text-text-primary hover:text-accent underline">
              Or Login to view all orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: No Order ID in URL (Search page)
  if (!id || !orderData) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div className="max-w-md w-full text-center py-16 bg-card border-4 border-text-primary rounded-xl wobbly-border-1 shadow-[6px_6px_0px_0px_rgba(30,27,20,1)] px-8">
          <span className="material-symbols-outlined text-6xl text-[#ff6b35] mb-4">search_check</span>
          <h2 className="font-display text-2xl font-black text-text-primary uppercase mb-2">Track Your Loot</h2>
          <p className="font-sans text-sm text-text-secondary mb-6">
            {isLoggedIn 
              ? 'Enter your order ID below to view its journey status.' 
              : 'Enter your order ID and verification contact to track your order.'}
          </p>
          
          {isLoggedIn ? (
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="e.g. F9B9DEEF" 
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="bg-card font-mono text-sm text-text-primary border-3 border-text-primary p-3 rounded focus:outline-none focus:border-[#ff6b35] text-center"
              />
              <button type="submit" className="bg-[#ff6b35] text-white font-display font-black py-4 px-6 border-3 border-[#343027] shadow-[4px_4px_0px_0px_#343027] hover:-translate-y-0.5 cursor-pointer uppercase text-sm">Track Now</button>
            </form>
          ) : (
            <form onSubmit={handleGuestSearchSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-black text-text-secondary uppercase">Order Code / ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. F9B9DEEF" 
                  value={guestIdInput}
                  onChange={e => setGuestIdInput(e.target.value)}
                  className="bg-card font-mono text-sm text-text-primary border-3 border-text-primary p-3 rounded focus:outline-none focus:border-[#ff6b35] text-center font-bold"
                />
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="font-mono text-[10px] font-black text-text-secondary uppercase">Email or Phone Number</label>
                <input 
                  type="text" 
                  placeholder="weirdo@example.com" 
                  value={contactInput}
                  onChange={e => setContactInput(e.target.value)}
                  className="bg-card font-mono text-sm text-text-primary border-3 border-text-primary p-3 rounded focus:outline-none focus:border-[#ff6b35] text-center font-bold"
                />
              </div>
              <button 
                type="submit" 
                disabled={isVerifying}
                className="bg-[#ff6b35] text-white font-display font-black py-4 px-6 border-3 border-[#343027] shadow-[4px_4px_0px_0px_#343027] hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer uppercase text-sm mt-2"
              >
                {isVerifying ? 'Searching...' : 'Track Now'}
              </button>
            </form>
          )}

          {trackingError && (
            <p className="text-xs text-rose-600 font-mono font-bold mt-4">{trackingError}</p>
          )}

          {!isLoggedIn && (
            <div className="mt-6 pt-6 border-t-2 border-dashed border-text-secondary/20">
              <Link to="/account" className="font-mono text-xs font-bold text-text-primary hover:text-accent underline">
                Or Login to view all orders
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* Local Styles for Order Tracking Page */}
      <style>{`
        .blob-card-1 {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .blob-card-2 {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .blob-card-3 {
            border-radius: 50% 50% 30% 70% / 50% 50% 70% 50%;
        }
        
        .hard-shadow-primary {
            box-shadow: 4px 4px 0px 0px #FF6B35;
        }
        .hard-shadow-secondary {
            box-shadow: 6px 6px 0px 0px #8B9A46;
        }
        .hard-shadow-inverse {
            box-shadow: 8px 8px 0px 0px #343027;
        }
        
        .wobbly-border {
            border: 3px solid #343027;
            border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }

        .jiggle-hover:hover {
            transform: scale(1.02) rotate(-1deg);
            box-shadow: 8px 8px 0px 0px #343027;
        }
        
        .dashed-path {
            background-image: linear-gradient(to bottom, #8B9A46 50%, transparent 50%);
            background-size: 2px 12px;
            background-repeat: repeat-y;
            background-position: center;
        }
      `}</style>

      <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-soft rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0 pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[#daeb8d] rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Status & Timeline */}
          <div className="flex-1 flex flex-col gap-12">
            {/* Header */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-[#343027] mb-2 uppercase font-black">
                Tracking Order #{orderData.orderCode || orderData.id.split('-')[0].toUpperCase()}
              </h1>
              <p className="font-mono text-xs text-text-secondary uppercase tracking-wider font-bold">Placed on {orderDateStr}</p>
            </div>

            {/* Weirdness Meter / Status Tracker */}
            <div className="relative pt-8 pb-4">
              <p className="absolute top-0 right-0 font-mono text-xs text-[#ff6b35] italic font-bold">Weirdness Meter</p>
              
              {/* Progress Bar Track */}
              <div className="h-4 w-full bg-[#e9e2d5] wobbly-border overflow-hidden flex relative">
                {/* Fill */}
                <div className="h-full bg-[#ff6b35] border-r-4 border-[#343027] relative transition-all duration-500" style={{ width: highlightedLineWidth }}>
                  {/* Striped pattern inside fill for texture */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #000 4px, #000 8px)' }}></div>
                </div>
              </div>

              {/* Nodes */}
              <div className="flex justify-between mt-4 relative font-mono text-xs text-center">
                
                {/* Node 1 Placed */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  <span className="material-symbols-outlined text-[#ff6b35] bg-card border-2 border-[#343027] rounded-full p-1 absolute -top-[34px] left-[12%]">check_circle</span>
                  <span className="text-[#343027] font-bold">Placed</span>
                </div>

                {/* Node 2 Packed */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  <span className={`material-symbols-outlined bg-card border-2 p-1 absolute -top-[34px] left-[37%] rounded-full ${
                    activeStep >= 2 ? 'text-[#ff6b35] border-[#343027]' : 'text-[#c8c6c5] border-[#c8c6c5]'
                  }`}>inventory_2</span>
                  <span className={`font-bold ${activeStep >= 2 ? 'text-[#343027]' : 'text-text-secondary opacity-60'}`}>Packed</span>
                </div>

                {/* Node 3 Shipped */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  {/* Current Stage Marker Bouncy */}
                  {activeStep === 3 ? (
                    <div className="absolute -top-[44px] left-[62%] animate-bounce">
                      <span className="material-symbols-outlined text-2xl text-white bg-[#8B9A46] border-2 border-[#343027] p-1.5 blob-card-1 shadow-[2px_2px_0px_0px_rgba(52,48,39,1)]">local_shipping</span>
                    </div>
                  ) : (
                    <span className={`material-symbols-outlined bg-card border-2 p-1 absolute -top-[34px] left-[62%] rounded-full ${
                      activeStep >= 3 ? 'text-[#ff6b35] border-[#343027]' : 'text-[#c8c6c5] border-[#c8c6c5]'
                    }`}>local_shipping</span>
                  )}
                  <span className={`font-bold ${activeStep >= 3 ? 'text-[#343027]' : 'text-text-secondary opacity-60'}`}>Shipped</span>
                </div>

                {/* Node 4 Delivered */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  {activeStep === 4 ? (
                    <div className="absolute -top-[44px] left-[87%] animate-bounce">
                      <span className="material-symbols-outlined text-2xl text-white bg-[#8B9A46] border-2 border-[#343027] p-1.5 blob-card-1 shadow-[2px_2px_0px_0px_rgba(52,48,39,1)]">home</span>
                    </div>
                  ) : (
                    <span className={`material-symbols-outlined bg-card border-2 p-1 absolute -top-[34px] left-[87%] rounded-full ${
                      activeStep >= 4 ? 'text-[#ff6b35] border-[#343027]' : 'text-[#c8c6c5] border-[#c8c6c5]'
                    }`}>home</span>
                  )}
                  <span className={`font-bold ${activeStep >= 4 ? 'text-[#343027]' : 'text-text-secondary opacity-60'}`}>Delivered</span>
                </div>
              </div>
            </div>

            {/* Status Callout Blob */}
            <div className="bg-[#ff6b35] p-8 blob-card-2 border-4 border-[#343027] hard-shadow-inverse flex flex-col md:flex-row items-center gap-6 relative mt-4">
              <img alt="Excited weirdo" className="w-24 h-24 absolute -top-12 -left-6 rotate-[-15deg] drop-shadow-xl blob-card-3 overflow-hidden border-2 border-[#343027] object-cover bg-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg35Izina1WDuvKXi_Jc9MXal-UahTuC4MM_cFy01AuBw_Kk6pxRWNtSFugdeJzVE3oQ8Z6LH8qArDLpIYu9009UogWJBEgjx4W5y3uLki2C93BwXjG-GEcH9HHbYA7OKASGOKq20d9ndpn8Pz97uCpqsleQOailReJNN4LlxtnBWlyXaZler2fBAZ-Z_Q-9v8pxPIdC4Jy-psXZU6K8CFlPX6CBMqkOTA4cr1CSE24VkY2A2UJSsKDm6KFMvKGjW1sFLWaMKysak" />
              <div className="flex-1 ml-4 md:ml-12 text-center md:text-left mt-6 md:mt-0">
                <h2 className="font-display text-xl font-black text-white mb-2 uppercase">Your loot status: {orderData.status}!</h2>
                <p className="font-sans text-sm text-white/90">
                  {orderData.status === 'PENDING' && "We've registered your order! Mascot dancing in progress."}
                  {orderData.status === 'PROCESSING' && 'Your package is packed and prepped at the hangar.'}
                  {orderData.status === 'SHIPPED' && "It's out there being weird in transit."}
                  {orderData.status === 'COMPLETED' && 'Delivered successfully. Keep staying strange!'}
                  {orderData.status === 'CANCELLED' && 'This order session was cancelled.'}
                </p>
                {orderData.status === 'CANCELLED' && orderData.cancelReason && (
                  <p className="font-sans text-xs text-white/80 mt-2 italic font-semibold">
                    Reason: {orderData.cancelReason}
                  </p>
                )}
                {orderData.status === 'PENDING' && (
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="mt-4 bg-[#e74c3c] text-white font-display font-black py-2 px-4 border-2 border-[#343027] shadow-[2px_2px_0px_0px_#343027] hover:-translate-y-0.5 transition-all cursor-pointer uppercase text-xs"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
              <div className="bg-card wobbly-border p-4 text-center min-w-[120px] rotate-3">
                <span className="block font-mono text-[10px] text-text-secondary uppercase mb-1 font-bold">Est. Arrival</span>
                <span className="block font-display text-2xl font-black text-[#ff6b35] uppercase">{estDate}</span>
              </div>
            </div>

            {/* Detailed Timeline */}
            <div className="mt-4">
              <h3 className="font-display text-xl font-black text-[#343027] mb-6 uppercase">The Journey</h3>
              <div className="bg-card border-4 border-[#8B9A46] blob-card-3 p-8 hard-shadow-secondary relative">
                
                {/* Timeline track line */}
                <div className="absolute top-[40px] bottom-[40px] left-[52px] w-1 dashed-path z-0"></div>
                
                <div className="flex flex-col gap-8 relative z-10">
                  
                  {/* Delivered Step */}
                  {activeStep >= 4 && (
                    <div className="flex gap-6 items-start group">
                      <div className="w-12 h-12 shrink-0 bg-[#8B9A46] border-3 border-[#343027] rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(52,48,39,1)] z-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white">home</span>
                      </div>
                      <div className="pt-1">
                        <span className="font-mono text-xs text-text-secondary block mb-1 font-bold">Courier Confirmed</span>
                        <p className="font-sans text-base text-[#343027] font-bold">Delivered at den door.</p>
                        <p className="font-sans text-xs text-text-secondary">Arrived safely. Thank you for shopping weird!</p>
                      </div>
                    </div>
                  )}

                  {/* Shipped Step */}
                  {activeStep >= 3 && (
                    <div className="flex gap-6 items-start group">
                      <div className="w-12 h-12 shrink-0 bg-[#ff6b35] border-3 border-[#343027] rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(52,48,39,1)] z-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white">local_shipping</span>
                      </div>
                      <div className="pt-1">
                        <span className="font-mono text-xs text-text-secondary block mb-1 font-bold">Transit Hand-off</span>
                        <p className="font-sans text-base text-[#343027] font-bold">Your weirdness has left the building.</p>
                        <p className="font-sans text-xs text-text-secondary">Package handed off to courier facility in Weirdsville.</p>
                      </div>
                    </div>
                  )}

                  {/* Packed Step */}
                  {activeStep >= 2 && (
                    <div className="flex gap-6 items-start group">
                      <div className="w-12 h-12 shrink-0 bg-[#8B9A46] border-3 border-[#343027] rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(52,48,39,1)] z-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white">inventory_2</span>
                      </div>
                      <div className="pt-1">
                        <span className="font-mono text-xs text-text-secondary block mb-1 font-bold">Fulfillment Center</span>
                        <p className="font-sans text-base text-[#343027] font-bold">Loot stuffed into a surprisingly normal box.</p>
                        <p className="font-sans text-xs text-text-secondary">Order packed and awaiting carrier pickup.</p>
                      </div>
                    </div>
                  )}

                  {/* Placed Step */}
                  {activeStep >= 1 && (
                    <div className="flex gap-6 items-start group">
                      <div className="w-12 h-12 shrink-0 bg-[#e9e2d5] border-3 border-[#343027] rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(52,48,39,1)] z-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[#594139]">shopping_cart_checkout</span>
                      </div>
                      <div className="pt-1">
                        <span className="font-mono text-xs text-text-secondary block mb-1 font-bold">{orderDateStr}</span>
                        <p className="font-sans text-base text-[#343027] font-bold">You did a thing! Order confirmed.</p>
                        <p className="font-sans text-xs text-text-secondary">We got your order and our mascots did a little dance.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Order Summary */}
          <aside className="w-full lg:w-96 flex flex-col gap-6">
            <div className="bg-card border-4 border-[#343027] p-6 blob-card-1 shadow-[6px_6px_0px_0px_rgba(52,48,39,0.15)] rotate-1">
              <h3 className="font-display text-lg font-black text-[#343027] mb-6 border-b-2 border-[#343027] pb-2 border-dashed uppercase">Order Summary</h3>
              
              {/* Items */}
              <div className="flex flex-col gap-4 mb-6">
                {orderData.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#e9e2d5] border-2 border-[#343027] overflow-hidden blob-card-2">
                      <img alt={item.product?.title} className="w-full h-full object-cover" src={item.product?.imgUrl} />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm font-bold text-[#343027] leading-tight">{item.product?.title}</p>
                      <p className="font-mono text-xs text-text-secondary mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-mono text-sm font-bold text-[#343027]">${(item.priceAtTime * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="bg-card border-2 border-[#343027] p-4 blob-card-1 mb-6">
                <p className="font-mono text-xs text-[#8B9A46] uppercase font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Shipping To
                </p>
                <p className="font-sans text-xs text-[#343027] leading-relaxed">
                  {orderData.shippingAddr || 'N/A'}
                </p>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-[#343027] pt-4 flex flex-col gap-2">
                <div className="flex justify-between font-mono text-xs text-[#594139]">
                  <span>Subtotal</span>
                  <span>${orderData.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-[#594139]">
                  <span>Shipping (Weird Speed)</span>
                  <span className="text-[#8B9A46] font-bold">Free!</span>
                </div>
                <div className="flex justify-between font-display text-base font-black text-[#343027] mt-2 pt-2 border-t border-dashed border-[#343027] uppercase">
                  <span>Total</span>
                  <span>${orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* CTA Help button */}
            <Link to="/contact" style={{ textDecoration: 'none' }} className="w-full">
              <button className="w-full bg-[#ff6b35] text-white font-display text-sm font-black py-4 px-6 blob-card-2 border-3 border-[#343027] jiggle-hover transition-all flex items-center justify-center gap-3 cursor-pointer uppercase shadow-[4px_4px_0px_0px_#343027]">
                <span className="material-symbols-outlined">support_agent</span>
                Need help with this order?
              </button>
            </Link>
          </aside>
          
        </div>
      </main>

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
                disabled={isCanceling || !selectedReason || (selectedReason === "Lý do khác (Other reason)" && !customReason.trim())}
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

export default OrderTracking;
