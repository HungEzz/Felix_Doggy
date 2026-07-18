import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const productStock = useSelector((state: RootState) => state.products.stock);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Re-fetch latest stock from server upon visiting Cart page
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(cartItems.map(i => i.id))
  );

  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      cartItems.forEach(item => {
        const stock = productStock[item.id] ?? item.stock;
        // Auto-add only if in stock
        if (!next.has(item.id) && stock > 0) next.add(item.id);
        // Auto-deselect if out of stock
        if (stock <= 0) next.delete(item.id);
      });
      // Remove IDs that no longer exist in cart
      next.forEach(id => {
        if (!cartItems.find(i => i.id === id)) next.delete(id);
      });
      return next;
    });
  }, [cartItems, productStock]);

  // Auto-clamp quantity when stock decreases
  useEffect(() => {
    cartItems.forEach(item => {
      const stock = productStock[item.id];
      if (stock !== undefined && stock > 0 && item.quantity > stock) {
        dispatch(updateQuantity({ id: item.id, quantity: stock }));
      }
    });
  }, [productStock, cartItems, dispatch]);

  // Calculate items in stock and selected
  const selectedItems = cartItems.filter(i => {
    const stock = productStock[i.id] ?? i.stock;
    return selectedIds.has(i.id) && stock > 0;
  });
  const totalPrice = selectedItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingFee = totalPrice > 0 && totalPrice < 100 ? 2.0 : 0.0;
  const finalTotal = totalPrice + shippingFee;
  const isAllSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;

  const toggleAll = () => {
    setSelectedIds(isAllSelected ? new Set() : new Set(cartItems.map(i => i.id)));
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (cartItems.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        minHeight: '60vh',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--bg-primary)',
      }}>
        <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: 24, strokeWidth: 1.5 }} />
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          marginBottom: 12,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          Your box is empty
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-mono)' }}>
          There are no weird loot items in your box.
        </p>
        <Link
          to="/bones"
          style={{
            background: 'var(--accent)',
            color: 'var(--text-primary)',
            border: '3px solid var(--text-primary)',
            padding: '14px 32px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: 14,
          }}
          className="wobbly-border-1 hard-shadow-hover"
        >
          Keep exploring the weird
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '48px 32px 80px',
      width: '100%',
      flexGrow: 1,
      background: 'var(--bg-primary)',
    }}>
      {/* Header */}
      <div className="mb-12 rotate-[-1deg] inline-block">
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-[#ff6b35]">
          Your Weird Loot
          <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.5em', marginLeft: 12, fontFamily: 'var(--font-mono)' }}>
            ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)
          </span>
        </h1>
      </div>

      {/* Select All Checkbox */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <label className="jiggle-hover" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontSize: 13,
          color: 'var(--text-primary)',
          fontWeight: 800,
          userSelect: 'none',
          fontFamily: 'var(--font-mono)',
          border: '2px solid var(--text-primary)',
          padding: '6px 12px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleAll}
            style={{
              width: 16,
              height: 16,
              accentColor: 'var(--accent)',
              cursor: 'pointer',
            }}
          />
          SELECT ALL ({cartItems.length})
        </label>
      </div>

      <div className="cart-layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        
        {/* Left Column: Cart items */}
        <div className="cart-items" style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cartItems.map((item, index) => {
            const isSelected = selectedIds.has(item.id);
            const currentStock = productStock[item.id] ?? item.stock;
            const isOutOfStock = currentStock <= 0;
            
            // Subtitle status tags
            const labelTexts: Record<string, string> = {
              dogs: 'Crunchy & Judgy',
              food: 'Zoomies Guaranteed',
              toys: 'Super Absurd & Fun',
              clothes: 'Saigon Wild'
            };
            const labelText = (item.category ? labelTexts[item.category] : null) || 'Saigon Wild';

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-[#efe7da] border-4 border-[#343027] shadow-[6px_6px_0px_0px_#8b9a46]"
                style={{
                  opacity: isOutOfStock ? 0.4 : isSelected ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  pointerEvents: isOutOfStock ? 'none' : 'auto',
                  borderRadius: index % 2 === 0 ? '255px 15px 225px 15px/15px 225px 15px 255px' : '20px 300px 30px 250px/250px 30px 300px 20px'
                }}
              >
                {/* Select Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem(item.id)}
                    disabled={isOutOfStock}
                    style={{
                      width: 20,
                      height: 20,
                      accentColor: 'var(--accent)',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 relative">
                  <Link to={`/product/${item.id}`} style={{ pointerEvents: 'auto' }}>
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover border-2 border-text-primary wobbly-border-1"
                      style={{
                        filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                      }}
                    />
                  </Link>
                  {isOutOfStock && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-md)',
                    }}>
                      <span style={{ fontSize: 10, color: '#fff', fontWeight: 900, background: '#ef4444', padding: '2px 6px', borderRadius: '4px' }}>OUT OF STOCK</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col sm:flex-row justify-between w-full gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-base font-black text-[#343027] uppercase">{item.title}</h3>
                    <span className="font-mono text-[10px] text-white bg-[#8b9a46] px-3 py-1 rounded-full border-2 border-[#343027] self-start inline-block font-extrabold">
                      {labelText}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto">
                    <div className="font-mono text-base font-black text-[#ff6b35]">${(item.price * item.quantity).toFixed(2)}</div>
                    
                    {/* Qty adjustments */}
                    {!isOutOfStock && (
                      <div className="flex items-center gap-3 border-2 border-[#343027] rounded-full px-3 py-1 bg-[#f5ede0]" style={{ pointerEvents: 'auto' }}>
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              dispatch(removeFromCart(item.id));
                            } else {
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                            }
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: 16 }}
                        >
                          -
                        </button>
                        <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          disabled={item.quantity >= currentStock}
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: 16, opacity: item.quantity >= currentStock ? 0.3 : 1 }}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Trash Button */}
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={{ pointerEvents: 'auto' }}
                      className="text-[#594139] hover:text-[#ba1a1a] transition-colors flex items-center gap-1 jiggle-hover font-mono text-[10px] font-black underline wavy-line border-0 bg-transparent cursor-pointer"
                    >
                      <Trash2 size={12} />
                      TOSS IT
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reassurance Strip */}
          <div className="mt-4 bg-[#8b9a46] p-3 wobbly-border-1 text-white flex flex-col sm:flex-row items-center justify-center gap-2 text-center transform -rotate-1 border-4 border-[#343027] shadow-[4px_4px_0px_0px_#343027]">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <div className="flex flex-col items-center sm:items-start font-mono">
              <span className="font-black text-sm uppercase">Free shipping on orders over $100</span>
              <span className="text-[10px] font-bold opacity-80">(Warning: do not feed after midnight)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="cart-summary" style={{ width: 300, flexShrink: 0 }}>
          <div className="bg-[#e9e2d5] border-4 border-[#343027] p-5 shadow-[6px_6px_0px_0px_#ff6b35] sticky top-32 flex flex-col gap-4 wobbly-border-2">
            <h2 className="font-display text-lg font-black text-[#343027] mb-2 uppercase">The Damage</h2>
            
            <div style={{ display: 'flex', justifyItems: 'space-between', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                <span>Shipping</span>
                {shippingFee > 0 ? (
                  <span>${shippingFee.toFixed(2)}</span>
                ) : (
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 900 }}>Free!</span>
                )}
              </div>
            </div>

            {/* Discount Code */}
            <div className="flex flex-col gap-1.5 mt-2 font-mono">
              <label className="font-extrabold text-xs text-[#343027]" htmlFor="promo">Weirdness Code</label>
              <div className="flex">
                <input
                  id="promo"
                  placeholder="Enter code"
                  type="text"
                  className="w-full bg-[#f5ede0] border-2 border-r-0 border-[#343027] p-2 font-bold text-xs rounded-l-md focus:outline-none focus:border-[#ff6b35]"
                />
                <button
                  onClick={() => toast.success('Coupon applied (Weirdness confirmed!)')}
                  className="bg-[#343027] text-white px-3 py-2 border-2 border-[#343027] rounded-r-md font-bold text-xs hover:bg-[#ff6b35] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="h-1 w-full bg-[#343027] rounded-full my-2 opacity-20"></div>

            <div className="flex justify-between items-end mb-3 font-mono">
              <span className="font-black text-[#343027]">Total</span>
              <span className="font-display text-2xl font-black text-[#ff6b35]">${finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { selectedIds: Array.from(selectedIds) } })}
              disabled={selectedItems.length === 0}
              className="w-full bg-[#ff6b35] text-white border-4 border-[#343027] py-3 px-4 font-display text-base font-black shadow-[4px_4px_0px_0px_#343027] jiggle-hover transition-all active:translate-y-1 active:translate-x-1 active:shadow-none uppercase tracking-wide cursor-pointer wobbly-border-1"
            >
              Continue to Payment
            </button>

            <Link
              to="/bones"
              className="text-center font-mono text-xs font-black text-text-primary hover:text-accent underline wavy-line mt-2 inline-block self-center transition-colors"
            >
              Keep exploring the weird
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout {
            flex-direction: column !important;
          }
          .cart-summary {
            width: 100% !important;
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          .cart-item {
            gap: 12px !important;
            padding: 16px 0 !important;
          }
          .cart-item-img {
            width: 72px !important;
            height: 72px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;