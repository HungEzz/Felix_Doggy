import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { clearCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import type { AppDispatch } from '../store';

type PaymentStatus = 'loading' | 'success' | 'pending' | 'error';

const OrderSuccess: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // COD flow: orderId from navigate state
  const codOrderId: string | undefined = (location.state as any)?.orderId;
  // PayOS flow: orderCode from URL query params after PayOS redirect
  const payosOrderCode = searchParams.get('orderCode');

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    codOrderId ? 'success' : 'loading',
  );
  const [orderData, setOrderData] = useState<any>((location.state as any)?.order || null);
  const [displayOrderCode, setDisplayOrderCode] = useState<string>('—');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // COD: set order code from UUID
  useEffect(() => {
    if (codOrderId) {
      setDisplayOrderCode(codOrderId.split('-')[0].toUpperCase());
    }
  }, [codOrderId]);

  // For COD orders: fetch details from /orders/my-orders if not already loaded in state
  useEffect(() => {
    if (!codOrderId || orderData) return;

    const fetchCodOrderDetails = async () => {
      try {
        const orders: any = await api.get('/orders/my-orders');
        const match = orders.find((o: any) => o.id === codOrderId);
        if (match) {
          setOrderData(match);
        }
      } catch (err) {
        console.error('Failed to fetch COD order details:', err);
      }
    };

    fetchCodOrderDetails();
  }, [codOrderId]);

  // PayOS: verify payment status from server (NOT trusting URL params)
  useEffect(() => {
    if (!payosOrderCode) return;

    const verifyPayment = async () => {
      try {
        const result: any = await api.get(`/orders/verify-payment/${payosOrderCode}`);
        const order = result?.order;
        setOrderData(order);
        setDisplayOrderCode(order?.orderCode || payosOrderCode);

        if (order?.status === 'PENDING') {
          // Payment confirmed — clear cart and refresh stock
          setPaymentStatus('success');
          dispatch(clearCart());
          dispatch(fetchProducts());
        } else if (order?.status === 'PENDING_PAYMENT') {
          // Webhook hasn't arrived yet — show waiting message
          setPaymentStatus('pending');
          // Still clear cart since payment was likely made
          dispatch(clearCart());
          dispatch(fetchProducts());
        } else {
          setPaymentStatus('error');
        }
      } catch (err: any) {
        console.error('Payment verification failed:', err);
        setPaymentStatus('error');
      }
    };

    verifyPayment();
  }, [payosOrderCode, dispatch]);

  // Determine stage progress
  const getStatusStep = () => {
    const status = orderData?.status || 'PENDING';
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
    : '25%';

  // Estimated arrival date calculation (5 days after creation)
  const estDate = orderData?.createdAt 
    ? new Date(new Date(orderData.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '3–5 days';

  // Receipt email target
  const customerEmail = orderData?.customerEmail || JSON.parse(localStorage.getItem('user') || '{}')?.email || 'weirdo@example.com';

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', flexGrow: 1 }}>
      <main className={`flex-grow flex flex-col items-center justify-center px-6 py-6 md:py-10 relative z-10 w-full max-w-4xl mx-auto transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        
        {/* Local Styles for Success Page shapes */}
        <style>{`
          .blob-shape-1 {
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          .blob-shape-2 {
              border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
          .blob-shape-3 {
              border-radius: 50% 50% 30% 70% / 50% 60% 40% 50%;
          }
          .brutalist-border {
              border: 3px solid var(--text-primary);
          }
          .brutalist-shadow {
              box-shadow: 6px 6px 0px 0px var(--text-primary);
          }
        `}</style>

        {/* Celebratory Mascot */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 mx-auto">
          <div className="absolute inset-0 bg-[#8B9A46] blob-shape-1 transform -rotate-6"></div>
          <img className="absolute inset-0 w-full h-full object-contain p-3 z-10" 
            alt="Goofy dog mascot celebrating" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrwt6Aw-Vb4ByCTCer5EP9X3zXpH0de6LFOCSXwPy_qWEyu61oB7k4OH1s6GnkQBzLGRmD-BinlbLjOcmIE1Q5HncYN4hd07T7McPlcdPWUP3LxvEzjw3cVGzzuRVnFfDpvB8knHaWhV8SkWF5lyV6f8ELKpSOEtZXjUKxvPcAwo32fdlIrwDqxlTW6tEcg9uVysLmIvL09XdJKvkVCIhrW5ULGkswaCMS9MTmQiN3T_Z4OZNBBjB2dehW2WwAezknMrCy4kBqaOg" />
          
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FF6B35] rounded-full brutalist-border z-20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">celebration</span>
          </div>
        </div>

        {/* Headings */}
        <div className="text-center mb-6 max-w-2xl">
          <h1 className="font-display text-3xl md:text-5xl text-text-primary transform -rotate-2 mb-2 leading-tight uppercase font-black">
            {paymentStatus === 'loading' ? 'Confirming...' : paymentStatus === 'error' ? 'Oh No!' : 'Weirdness confirmed!'}
          </h1>
          <p className="font-sans text-sm text-text-secondary font-bold">
            {paymentStatus === 'loading' 
              ? 'We are verifying your online payment session.' 
              : paymentStatus === 'error' 
              ? 'We encountered an error verifying your payment.' 
              : `Order #${displayOrderCode} is on its way to your pal's den.`}
          </p>
        </div>

        {/* Weirdness Progress Bar (Order Status Tracker) */}
        {paymentStatus !== 'error' && (
          <div className="w-full mb-8 px-4">
            <div className="relative flex items-center justify-between">
              {/* Connecting Line */}
              <div className="absolute left-0 top-1/2 w-full h-1 bg-text-secondary/20 -z-10 brutalist-border"></div>
              {/* Highlighted Line */}
              <div className="absolute left-0 top-1/2 h-1 bg-[#FF6B35] -z-10 brutalist-border transition-all duration-500" style={{ width: highlightedLineWidth }}></div>

              {/* Stage 1 Placed */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full brutalist-border flex items-center justify-center transform rotate-6 mb-2 ${
                  activeStep >= 1 ? 'bg-[#FF6B35] brutalist-shadow text-white' : 'bg-card text-text-muted'
                }`}>
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded-full ${
                  activeStep >= 1 ? 'font-bold bg-card border-2 border-text-primary' : 'text-text-secondary opacity-60'
                }`}>Placed</span>
              </div>

              {/* Stage 2 Packed */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full brutalist-border flex items-center justify-center transform -rotate-3 mb-2 ${
                  activeStep >= 2 ? 'bg-[#FF6B35] brutalist-shadow text-white' : 'bg-card text-text-muted'
                }`}>
                  {activeStep >= 2 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : <div className="w-2.5 h-2.5 rounded-full bg-text-secondary/20"></div>}
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded-full ${
                  activeStep >= 2 ? 'font-bold bg-card border-2 border-text-primary' : 'text-text-secondary opacity-60'
                }`}>Packed</span>
              </div>

              {/* Stage 3 Shipped */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full brutalist-border flex items-center justify-center transform rotate-2 mb-2 ${
                  activeStep >= 3 ? 'bg-[#FF6B35] brutalist-shadow text-white' : 'bg-card text-text-muted'
                }`}>
                  {activeStep >= 3 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : <div className="w-2.5 h-2.5 rounded-full bg-text-secondary/20"></div>}
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded-full ${
                  activeStep >= 3 ? 'font-bold bg-card border-2 border-text-primary' : 'text-text-secondary opacity-60'
                }`}>Shipped</span>
              </div>

              {/* Stage 4 Delivered */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full brutalist-border flex items-center justify-center transform -rotate-6 mb-2 ${
                  activeStep >= 4 ? 'bg-[#FF6B35] brutalist-shadow text-white' : 'bg-card text-text-muted'
                }`}>
                  {activeStep >= 4 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : <div className="w-2.5 h-2.5 rounded-full bg-text-secondary/20"></div>}
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded-full ${
                  activeStep >= 4 ? 'font-bold bg-card border-2 border-text-primary' : 'text-text-secondary opacity-60'
                }`}>Delivered</span>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary Card */}
        {orderData && (
          <div className="w-full bg-card p-8 blob-shape-2 brutalist-border brutalist-shadow mb-12 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#8B9A46] rounded-full opacity-20 -z-10 blur-xl"></div>
            <h2 className="font-display text-2xl font-black text-text-primary mb-6 flex items-center gap-2 uppercase">
              <span className="material-symbols-outlined text-[#FF6B35]">receipt_long</span>
              The Goods
            </h2>

            {/* Items list */}
            <ul className="space-y-4 mb-6 relative">
              {orderData.orderItems?.map((item: any, i: number) => (
                <li key={item.id} 
                  className={`flex justify-between items-center bg-secondary p-4 rounded-xl border-3 border-text-primary transform ${
                    i % 2 === 0 ? 'rotate-1' : '-rotate-1'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-card rounded-lg border-2 border-text-primary overflow-hidden blob-shape-3">
                      <img className="w-full h-full object-cover" alt={item.product?.title} src={item.product?.imgUrl} />
                    </div>
                    <div>
                      <span className="font-sans text-sm font-bold block text-text-primary">{item.product?.title}</span>
                      <span className="font-mono text-xs text-text-secondary">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-black bg-[#8B9A46] text-white px-3 py-1 rounded-full border-2 border-text-primary transform ${
                    i % 2 === 0 ? '-rotate-3' : 'rotate-2'
                  }`}>
                    ${(item.priceAtTime * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-text-secondary/40">
              <div className="bg-secondary p-4 rounded-2xl border-2 border-text-primary relative">
                <span className="absolute -top-3 left-4 bg-[#FF6B35] text-white font-mono text-[10px] font-bold px-2 py-1 rounded-full border-2 border-text-primary transform -rotate-6 uppercase">Ship To</span>
                <p className="font-sans text-xs text-text-primary mt-2 leading-relaxed">{orderData.shippingAddr || 'N/A'}</p>
              </div>
              <div className="bg-secondary p-4 rounded-2xl border-2 border-text-primary relative">
                <span className="absolute -top-3 left-4 bg-[#8B9A46] text-white font-mono text-[10px] font-bold px-2 py-1 rounded-full border-2 border-text-primary transform rotate-3 uppercase">Arriving</span>
                <p className="font-display text-lg font-black text-[#8B9A46] mt-2 uppercase">{estDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mb-12">
          <Link to={`/order-tracking/${displayOrderCode}`} className="w-full sm:w-auto text-decoration-none">
            <button className="bg-[#FF6B35] text-white font-display text-base font-black py-4 px-8 blob-shape-3 brutalist-border brutalist-shadow jiggle-hover transition-transform duration-200 w-full cursor-pointer uppercase tracking-wide">
              Track My Order
            </button>
          </Link>
          <Link to="/bones" className="w-full sm:w-auto text-decoration-none">
            <button className="bg-card text-text-primary font-display text-base font-black py-4 px-8 blob-shape-1 brutalist-border transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(30,27,20,1)] w-full cursor-pointer uppercase tracking-wide">
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="font-sans text-sm text-center max-w-lg text-text-secondary bg-secondary p-4 rounded-xl border-2 border-text-primary transform rotate-1">
          We've emailed your receipt to <span className="font-bold underline decoration-[#FF6B35] decoration-2">{customerEmail}</span>. Check your spam folder — sometimes weird gets flagged.
        </p>

      </main>
    </div>
  );
};

export default OrderSuccess;