import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { clearCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { updateProfile } from '../store/userSlice';
import api from '../services/api';
import toast from 'react-hot-toast';


interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  payment: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  phone?: string;
}

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const passedSelectedIds: number[] | undefined = (location.state as any)?.selectedIds;

  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    if (passedSelectedIds && passedSelectedIds.length > 0) {
      const cartIdSet = new Set(cartItems.map((i) => i.id));
      const valid = passedSelectedIds.filter((id) => cartIdSet.has(id));
      return new Set(valid.length > 0 ? valid : cartItems.map((i) => i.id));
    }
    return new Set(cartItems.map((i) => i.id));
  });

  useEffect(() => {
    const cartIdSet = new Set(cartItems.map((i) => i.id));
    setSelectedIds((prev) => {
      const next = new Set<number>();
      prev.forEach((id) => {
        if (cartIdSet.has(id)) next.add(id);
      });
      return next;
    });
  }, [cartItems]);

  const selectedItems = cartItems.filter((item) => selectedIds.has(item.id));
  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingFee = totalPrice > 0 && totalPrice < 100 ? 2.0 : 0.0;
  const finalTotal = totalPrice + shippingFee;

  const isAllSelected =
    cartItems.length > 0 && selectedIds.size === cartItems.length;

  const toggleAll = () => {
    setSelectedIds(
      isAllSelected ? new Set() : new Set(cartItems.map((i) => i.id)),
    );
  };

  const toggleItem = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const [formData, setFormData] = useState<FormData>(() => {
    let street = '';
    let city = '';
    if (userProfile?.address) {
      const parts = userProfile.address.split(',');
      street = parts[0]?.trim() || '';
      city = parts.slice(1).join(',').trim() || '';
    }

    return {
      fullName: userProfile?.name || '',
      email: userProfile?.email || '',
      address: street,
      city: city,
      phone: userProfile?.phone || '',
      payment: 'cod',
    };
  });

  useEffect(() => {
    if (!userProfile) return;
    let street = '';
    let city = '';
    if (userProfile.address) {
      const parts = userProfile.address.split(',');
      street = parts[0]?.trim() || '';
      city = parts.slice(1).join(',').trim() || '';
    }
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || userProfile.name || '',
      email: prev.email || userProfile.email || '',
      phone: prev.phone || userProfile.phone || '',
      address: prev.address || street,
      city: prev.city || city,
    }));
  }, [userProfile]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Please enter your email.';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.address.trim()) newErrors.address = 'Please enter your shipping address.';
    if (!formData.city.trim()) newErrors.city = 'Please enter your city.';
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number.';
    else if (!phoneRegex.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Invalid phone number (e.g., 0901234567).';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to checkout.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddr: `${formData.address}, ${formData.city}`,
        paymentMethod: formData.payment,
        items: selectedItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      };

      const result: any = await api.post('/orders/checkout', payload);

      if (userProfile) {
        const profileUpdates: Record<string, string> = {};
        if (!userProfile.name && formData.fullName.trim()) profileUpdates.name = formData.fullName.trim();
        if (!userProfile.phone && formData.phone.trim()) profileUpdates.phone = formData.phone.trim();
        if (!userProfile.address && formData.address.trim()) {
          profileUpdates.address = `${formData.address.trim()}, ${formData.city.trim()}`;
        }
        if (Object.keys(profileUpdates).length > 0) {
          dispatch(updateProfile(profileUpdates));
        }
      }

      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      dispatch(clearCart());
      dispatch(fetchProducts());

      toast.success('Order placed successfully!', {
        className: 'toast-custom',
      });

      navigate('/order-success', { state: { orderId: result?.order?.id, order: result?.order } });
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while placing order';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full p-3 bg-white drawn-input font-mono text-xs text-text-primary ${
      errors[field]
        ? 'border-red-500 bg-red-50'
        : 'focus:border-accent'
    }`;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 w-full text-text-primary">
      
      {/* Progress Tracker */}
      <div className="flex justify-center items-center flex-col gap-4 mb-12">
        <div className="flex items-center gap-4 mt-6">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-accent text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="font-mono text-xs font-black text-text-primary">Shipping</span>
          </div>
          <div className="w-16 h-1 border-t-2 border-dashed border-text-primary mt-[-24px]"></div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-text-primary text-3xl">pets</span>
            <span className="font-mono text-xs font-black text-text-primary">Payment</span>
          </div>
          <div className="w-16 h-1 border-t-2 border-dashed border-text-primary mt-[-24px]"></div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-text-primary text-3xl">pets</span>
            <span className="font-mono text-xs font-black text-text-primary">Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Checkout Forms */}
        <main className="lg:col-span-7 flex flex-col gap-8">
          <section className="bg-secondary border-4 border-text-primary p-8 brutalist-shadow rounded-[20px_40px_10px_30px] relative overflow-hidden">
            
            {/* Secure badge */}
            <div className="absolute -top-4 -right-4 bg-accent text-text-primary px-4 py-2 font-mono text-xs font-black rotate-12 border-2 border-text-primary shadow">
              <span className="material-symbols-outlined align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              SECURE!
            </div>

            <h2 className="font-display text-2xl font-black mb-8 flex items-center gap-2 uppercase">
              <span className="material-symbols-outlined text-accent">contact_mail</span>
              Who's Getting This Weird Stuff?
            </h2>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              
              {/* Email Address */}
              <div>
                <label className="block font-mono text-xs font-black mb-2 text-text-primary">EMAIL (FOR STRANGE RECEIPTS)</label>
                <input
                  name="email"
                  type="email"
                  placeholder="weirdo@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 uppercase font-mono font-black">{errors.email}</p>
                )}
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-black mb-2 text-text-primary">FULL NAME</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Wobbly Weirdo"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[10px] mt-1 uppercase font-mono font-black">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block font-mono text-xs font-black mb-2 text-text-primary">PHONE NUMBER</label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass('phone')}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] mt-1 uppercase font-mono font-black">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address details */}
              <div>
                <label className="block font-mono text-xs font-black mb-2 text-text-primary">SHIPPING ADDRESS (WHERE THE DOG LIVES)</label>
                <input
                  name="address"
                  type="text"
                  placeholder="123 Strange St"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass('address')}
                />
                {errors.address && (
                  <p className="text-red-500 text-[10px] mt-1 uppercase font-mono font-black">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs font-black mb-2 text-text-primary">CITY / PROVINCE</label>
                <input
                  name="city"
                  type="text"
                  placeholder="Saigon"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass('city')}
                />
                {errors.city && (
                  <p className="text-red-500 text-[10px] mt-1 uppercase font-mono font-black">{errors.city}</p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="mt-8 pt-8 border-t-4 border-text-primary border-dashed">
                <h2 className="font-display text-2xl font-black mb-6 flex items-center gap-2 uppercase">
                  <span className="material-symbols-outlined text-accent">payments</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* COD Payment Method */}
                  <label className="relative cursor-pointer">
                    <input
                      name="payment"
                      type="radio"
                      value="cod"
                      checked={formData.payment === 'cod'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-4 border-4 border-[#1e1b14] rounded-[15px_35px_15px_35px] bg-white hover:bg-[#efe7da] transition-all duration-200 peer-checked:bg-[#daeb8d] peer-checked:shadow-[4px_4px_0px_0px_rgba(30,27,20,1)] peer-checked:-translate-y-0.5 h-full">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 blob-shape-2 bg-[#ff6b35] flex items-center justify-center border-2 border-[#1e1b14] shrink-0">
                          <span className="material-symbols-outlined text-[#1e1b14]">payments</span>
                        </div>
                        <div>
                          <p className="font-black font-mono text-sm text-[#1e1b14]">Cash on Delivery</p>
                          <p className="text-xs text-[#594139] font-mono font-bold mt-1">Pay the delivery weirdo in cash</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Online Payment (PayOS) Method */}
                  <label className="relative cursor-pointer">
                    <input
                      name="payment"
                      type="radio"
                      value="payos"
                      checked={formData.payment === 'payos'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-4 border-4 border-[#1e1b14] rounded-[30px_10px_40px_20px] bg-white hover:bg-[#efe7da] transition-all duration-200 peer-checked:bg-[#daeb8d] peer-checked:shadow-[4px_4px_0px_0px_rgba(30,27,20,1)] peer-checked:-translate-y-0.5 h-full">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 blob-shape-2 bg-[#ff6b35] flex items-center justify-center border-2 border-[#1e1b14] shrink-0">
                          <span className="material-symbols-outlined text-[#1e1b14]">qr_code_2</span>
                        </div>
                        <div>
                          <p className="font-black font-mono text-sm text-[#1e1b14]">PayOS Payment</p>
                          <p className="text-xs text-[#594139] font-mono font-bold mt-1">Scan QR code instantly via Bank Transfer</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="w-full bg-accent text-text-primary border-4 border-text-primary py-4 px-8 font-display text-xl font-black shadow-[4px_4px_0px_0px_#343027] jiggle-hover transition-all active:translate-y-1 active:translate-x-1 active:shadow-none uppercase tracking-wide cursor-pointer wobbly-border-1 mt-6"
              >
                {isSubmitting ? 'PROCESSING...' : 'Confirm Order'}
              </button>

            </form>
          </section>
        </main>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-surface-secondary border-4 border-text-primary p-8 shadow-[8px_8px_0px_0px_#ff6b35] sticky top-32 flex flex-col gap-6 wobbly-border-3">
            <h2 className="font-display text-2xl font-black text-text-primary mb-2 uppercase">The Damage</h2>

            {/* Select All */}
            <label className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-dashed border-text-primary cursor-pointer group font-mono text-xs font-black">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleAll}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span>SELECT ALL ({cartItems.length} items)</span>
            </label>

            {/* Summary Items List */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex gap-3 items-center cursor-pointer rounded transition-opacity ${
                      isSelected ? '' : 'opacity-40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 cursor-pointer flex-shrink-0"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="w-12 h-12 object-cover bg-secondary border-2 border-text-primary flex-shrink-0 wobbly-border-1"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-mono text-xs font-black uppercase truncate">
                        {item.title}
                      </p>
                      <p className="font-mono text-[10px] text-text-muted font-bold">
                        x{item.quantity}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-sm font-black whitespace-nowrap ${
                        isSelected ? '' : 'line-through text-text-muted'
                      }`}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="border-t-3 border-text-primary pt-4 space-y-2 mb-4 font-mono text-xs font-black">
              <div className="flex justify-between">
                <span>Subtotal ({selectedItems.length} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingFee > 0 ? (
                  <span>${shippingFee.toFixed(2)}</span>
                ) : (
                  <span className="text-accent-secondary font-black">Free!</span>
                )}
              </div>
            </div>

            <div className="border-t-3 border-text-primary pt-4 flex justify-between font-display text-xl font-black">
              <span>Total</span>
              <span className="text-accent font-black">${finalTotal.toFixed(2)}</span>
            </div>

            {selectedItems.length === 0 && (
              <p className="text-red-500 text-xs font-black font-mono text-center">
                Please select at least 1 item to proceed.
              </p>
            )}

            <Link
              to="/bones"
              className="text-center font-mono text-xs font-black text-text-primary hover:text-accent underline wavy-line mt-2 inline-block self-center transition-colors"
            >
              Keep exploring the weird
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;