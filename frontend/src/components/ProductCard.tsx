import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { ShoppingBag, Plus, Minus, X, Heart } from 'lucide-react';
import type { Product } from '../types';
import type { RootState } from '../store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, size = 'md', showCategory = true }) => {
  const dispatch = useDispatch();
  const productStocks = useSelector((state: RootState) => state.products.stock);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const wished = wishlistItems.some(item => item.id === product.id);

  const currentStock = productStocks[product.id] ?? product.stock;
  const inCartQty = cartItems.find(i => i.id === product.id)?.quantity ?? 0;
  const maxAddable = Math.max(0, currentStock - inCartQty);
  const isOutOfStock = currentStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) { toast.error('Out of stock'); return; }
    if (maxAddable <= 0) { toast.error('Already at max quantity in cart'); return; }
    setQty(1);
    setShowModal(true);
  };

  const confirmAdd = () => {
    if (inCartQty + qty > currentStock) { toast.error('Exceeds available stock'); return; }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`Added ${qty > 1 ? `${qty}× ` : ''}${product.title}`, {
      style: { borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '3px solid var(--text-primary)' },
    });
    setShowModal(false);
  };

  // Determine wobbly shapes based on ID to randomize product grid shapes
  const wobblyCardClasses = ['wobbly-border-2', 'wobbly-border-3', 'wobbly-border-1'];
  const wobblyCardClass = wobblyCardClasses[product.id % 3];

  const wobblyImgClasses = ['wobbly-border-1', 'wobbly-border-2', 'wobbly-border-3'];
  const wobblyImgClass = wobblyImgClasses[(product.id + 1) % 3];

  return (
    <>
      <div 
        className={`bg-card p-4 flex flex-col gap-4 border-4 border-text-primary hard-shadow-hover transition-transform duration-200 ${wobblyCardClass}`}
        style={{ height: '100%' }}
      >
        {/* Image wrapper */}
        <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div className={`overflow-hidden border-2 border-text-primary relative aspect-[4/3] ${wobblyImgClass}`}>
            <img 
              src={product.imgUrl} 
              alt={product.title} 
              loading="lazy" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />

            {/* Stock badge */}
            {isOutOfStock && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  background: 'rgba(244,63,94,0.9)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-md)',
                  letterSpacing: '0.06em',
                  border: '2px solid var(--text-primary)',
                  boxShadow: '2px 2px 0 0 var(--text-primary)'
                }}>
                  SOLD OUT
                </span>
              </div>
            )}

            {/* Category label */}
            {showCategory && (
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--text-primary)',
                fontSize: 9,
                fontWeight: 900,
                padding: '3px 10px',
                borderRadius: 'var(--radius-md)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)'
              }}>
                {product.category === 'dogs' ? 'Adopt a Dog' : product.category === 'food' ? 'Dog Food' : product.category === 'toys' ? 'Dog Toys' : 'Dog Clothes'}
              </div>
            )}

            {/* Wishlist Heart */}
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); dispatch(toggleWishlist(product)); }}
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 32, height: 32, 
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '2px solid var(--text-primary)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="jiggle-hover"
            >
              <Heart
                size={14}
                color={wished ? '#f43f5e' : 'var(--text-primary)'}
                fill={wished ? '#f43f5e' : 'none'}
              />
            </button>
          </div>
        </Link>

        {/* Product Details info */}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
          <div>
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: size === 'sm' ? 14 : 16,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                marginBottom: 6,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textTransform: 'uppercase'
              }}
              >
                {product.title}
              </h3>
            </Link>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.artist}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: size === 'sm' ? 16 : 18,
              color: 'var(--text-primary)',
            }}>
              ${product.price.toFixed(2)}
            </span>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="organic-brutalism-btn bg-accent text-text-primary px-3 py-1.5 font-mono text-xs font-black uppercase wobbly-border-1 cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag size={12} />
              {isOutOfStock ? 'SOLD OUT' : 'ADD'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-card p-8 border-4 border-text-primary wobbly-border-2 brutalist-shadow relative max-w-sm w-full"
          >
            <button
              onClick={() => setShowModal(false)}
              className="jiggle-hover"
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--bg-secondary)', border: '2px solid var(--text-primary)',
                borderRadius: 'var(--radius-md)', width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <img
                src={product.imgUrl}
                alt={product.title}
                className="w-16 h-16 object-cover border-2 border-text-primary wobbly-border-1"
              />
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4, textTransform: 'uppercase' }}>{product.title}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{product.artist}</p>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--accent)', fontSize: 17 }}>${product.price.toFixed(2)}</span>
              </div>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>Select Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div className="hard-shadow" style={{ display: 'flex', alignItems: 'center', border: '3px solid var(--text-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                  style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: qty <= 1 ? 0.3 : 1 }}>
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 16px', fontWeight: 900, fontSize: 15, color: 'var(--text-primary)', minWidth: 32, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(maxAddable, q + 1))} disabled={qty >= maxAddable}
                  style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: qty >= maxAddable ? 0.3 : 1 }}>
                  <Plus size={14} />
                </button>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {currentStock} left
              </span>
            </div>

            <button
              onClick={confirmAdd}
              className="w-full bg-accent text-text-primary border-4 border-text-primary py-4 px-6 font-display text-sm font-black shadow-[4px_4px_0px_0px_#343027] jiggle-hover transition-all uppercase tracking-wide cursor-pointer wobbly-border-1"
            >
              Add to Box — ${(product.price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;