import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
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
  const [orderData, setOrderData] = useState<any>(null);
  const [displayOrderCode, setDisplayOrderCode] = useState<string>('—');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // COD: set order code from UUID
  useEffect(() => {
    if (codOrderId) {
      setDisplayOrderCode(`#${codOrderId.split('-')[0].toUpperCase()}`);
    }
  }, [codOrderId]);

  // PayOS: verify payment status from server (NOT trusting URL params)
  useEffect(() => {
    if (!payosOrderCode) return;

    const verifyPayment = async () => {
      try {
        const result: any = await api.get(`/orders/verify-payment/${payosOrderCode}`);
        const order = result?.order;
        setOrderData(order);
        setDisplayOrderCode(`#${order?.orderCode || payosOrderCode}`);

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

  const statusConfig = {
    loading: {
      icon: <Clock size={64} strokeWidth={1} className="text-muted animate-pulse" />,
      label: 'Đang xác nhận thanh toán',
      title: 'Vui lòng chờ...',
      message: 'Hệ thống đang xác nhận thanh toán của bạn.',
      submessage: '',
    },
    success: {
      icon: <CheckCircle size={64} strokeWidth={1} className="text-accent" />,
      label: 'Đặt hàng thành công',
      title: 'Cảm ơn bạn!',
      message: 'Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.',
      submessage: 'Chúng tôi sẽ gửi email xác nhận sớm nhất có thể.',
    },
    pending: {
      icon: <Clock size={64} strokeWidth={1} className="text-yellow-500" />,
      label: 'Đang chờ xác nhận thanh toán',
      title: 'Gần xong rồi!',
      message: 'Hệ thống đang chờ xác nhận thanh toán từ ngân hàng.',
      submessage: 'Đơn hàng sẽ được xử lý ngay khi thanh toán được xác nhận. Vui lòng kiểm tra lại sau vài phút.',
    },
    error: {
      icon: <AlertCircle size={64} strokeWidth={1} className="text-red-500" />,
      label: 'Lỗi thanh toán',
      title: 'Có lỗi xảy ra',
      message: 'Không thể xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.',
      submessage: '',
    },
  };

  const config = statusConfig[paymentStatus];

  return (
    <div className="flex-grow flex items-center justify-center px-6 py-20">
      <div
        className={`w-full max-w-[520px] text-center transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className={`transition-all duration-500 delay-200 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            {config.icon}
          </div>
        </div>

        {/* Title */}
        <div
          className={`transition-all duration-500 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted mb-4 block">
            {config.label}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide font-display mb-4 text-primary">
            {config.title}
          </h1>
          <p className="text-sm text-secondary font-sans leading-relaxed mb-2">
            {config.message}
          </p>
          {config.submessage && (
            <p className="text-sm text-secondary font-sans">
              {config.submessage}
            </p>
          )}
        </div>

        {/* Order Code */}
        <div
          className={`my-10 py-6 px-8 bg-card border border-token text-primary transition-all duration-500 delay-[400ms] ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">Mã đơn hàng</p>
          <p className="text-2xl font-bold font-display tracking-widest text-primary">{displayOrderCode}</p>
          {orderData?.paymentMethod === 'payos' && paymentStatus === 'success' && (
            <p className="text-[10px] uppercase tracking-wider text-accent mt-2 font-semibold">
              ✓ Đã thanh toán online
            </p>
          )}
          {paymentStatus === 'pending' && (
            <p className="text-[10px] uppercase tracking-wider text-yellow-500 mt-2 font-semibold animate-pulse">
              ⏳ Đang xác nhận...
            </p>
          )}
        </div>

        {/* Info boxes */}
        <div
          className={`grid grid-cols-2 gap-4 mb-10 text-left transition-all duration-500 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="border border-token bg-card p-5 text-primary">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-2">Giao hàng</p>
            <p className="text-xs font-sans text-secondary leading-relaxed">
              Dự kiến 3–5 ngày làm việc
            </p>
          </div>
          <div className="border border-token bg-card p-5 text-primary">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-2">Hỗ trợ</p>
            <p className="text-xs font-sans text-secondary leading-relaxed">
              support@recordstore.vn
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`flex flex-col sm:flex-row gap-3 justify-center transition-all duration-500 delay-[600ms] ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            to="/"
            className="px-10 py-4 uppercase tracking-widest text-[10px] font-bold transition-all duration-300 font-sans text-center"
            style={{
              background: 'var(--accent)',
              color: '#000',
              boxShadow: 'var(--shadow-accent)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-dim)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
            }}
          >
            Về trang chủ
          </Link>
          <Link
            to="/vinyl"
            className="border border-token px-10 py-4 uppercase tracking-widest text-[10px] font-bold transition-all duration-300 font-sans bg-card text-primary text-center"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;