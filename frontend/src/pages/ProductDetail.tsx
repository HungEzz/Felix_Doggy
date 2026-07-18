import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import FeaturedProducts from '../components/FeaturedProducts';
import type { RootState } from '../store';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeImg, setActiveImg] = useState<string>('');

  const allProducts = useSelector((state: RootState) => state.products.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const productsStatus = useSelector((state: RootState) => state.products.status);

  const currentProduct = useMemo(() => {
    if (!allProducts.length) return null;
    return allProducts.find(p => p.id === Number(id)) ?? null;
  }, [id, allProducts]);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wished = wishlistItems.some(item => item.id === currentProduct?.id);

  const currentStock = useSelector((state: RootState) =>
    currentProduct ? (state.products.stock[currentProduct.id] ?? currentProduct.stock) : 0
  );
  const inCartQty = useMemo(() => cartItems.find(i => i.id === currentProduct?.id)?.quantity ?? 0, [cartItems, currentProduct]);
  const maxAddable = Math.max(0, currentStock - inCartQty);

  const relatedProducts = useMemo(() => {
    if (!currentProduct) return [];
    return allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
  }, [currentProduct, allProducts]);

  if (productsStatus === 'loading' || productsStatus === 'idle') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="animate-spin-slow" style={{ width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(circle, #333 0%, #333 28%, var(--accent) 28%, var(--accent) 32%, #1a1a1a 32%)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32 }}>
        <span style={{ fontSize: 56 }}>🦴</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>404</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Product not found.</p>
        <Link to="/bones" style={{ background: 'var(--accent)', color: 'var(--text-primary)', border: '3px solid var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '12px 24px', textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
          Browse Collection
        </Link>
      </div>
    );
  }

  const isOutOfStock = currentStock <= 0;
  const isAtMax = maxAddable <= 0 && !isOutOfStock;

  // Category labels and path helper
  const categoryMeta: Record<string, { label: string; to: string; color: string }> = {
    dogs: { label: 'Adopt a Dog', to: '/paws', color: 'var(--accent-secondary)' },
    food: { label: 'Dog Food', to: '/bones', color: 'var(--accent)' },
    toys: { label: 'Dog Toys', to: '/toys', color: 'var(--accent-secondary)' },
    clothes: { label: 'Dog Clothes', to: '/clothes', color: 'var(--accent)' }
  };
  const cat = (currentProduct.category && categoryMeta[currentProduct.category]) || { label: 'Dog Food', to: '/bones', color: 'var(--accent)' };

  const handleAddToCart = () => {
    if (isOutOfStock || isAtMax) return;
    if (inCartQty + selectedQty > currentStock) { toast.error('Exceeds available stock'); return; }
    dispatch(addToCart({ product: currentProduct, quantity: selectedQty }));
    setIsAdded(true);
    setSelectedQty(1);
    toast.success(`Added ${selectedQty > 1 ? `${selectedQty}× ` : ''}${currentProduct.title}`, {
      style: { borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '3px solid var(--text-primary)' },
    });
    setTimeout(() => setIsAdded(false), 2500);
  };

  useEffect(() => {
    if (currentProduct) {
      setActiveImg(currentProduct.imgUrl);
    }
  }, [currentProduct]);

  const images = useMemo(() => {
    if (!currentProduct) return [];
    if (currentProduct.images && currentProduct.images.length > 0) {
      return currentProduct.images;
    }
    return [currentProduct.imgUrl];
  }, [currentProduct]);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="container-main" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
            Home
          </Link>
          <span>/</span>
          <Link to={cat.to} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
            {cat.label}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{currentProduct.title}</span>
        </nav>

        {/* Main layout */}
        <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          
          {/* Left Column: Image Stack */}
          <div className="pd-image" style={{ position: 'sticky', top: 96 }}>
            <div className="wobbly-border-1" style={{
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              border: '4px solid var(--text-primary)',
              aspectRatio: '1.25',
              position: 'relative',
            }}>
              <img
                src={activeImg || currentProduct.imgUrl}
                alt={currentProduct.title}
                className="hard-shadow-lg"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
                onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
              />

              {isOutOfStock && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: 'rgba(244,63,94,0.9)', color: '#fff', fontSize: 14, fontWeight: 900, padding: '8px 20px', borderRadius: 'var(--radius-md)', letterSpacing: '0.08em', border: '3px solid var(--text-primary)', boxShadow: '4px 4px 0 0 var(--text-primary)' }}>
                    SOLD OUT
                  </span>
                </div>
              )}

              {/* Category pill */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '3px solid var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '4px 14px',
                fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em',
                fontFamily: 'var(--font-mono)'
              }}>
                {cat.label}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto py-4">
              {images.map((img, idx) => {
                const isActive = activeImg === img;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveImg(img)}
                    className={`flex-shrink-0 w-20 h-20 border-4 overflow-hidden bg-[#efe7da] transition-all cursor-pointer ${
                      isActive 
                        ? 'border-accent shadow-[2px_2px_0px_0px_#1e1b14] scale-105' 
                        : 'border-[#1e1b14] opacity-70 hover:opacity-100 hover:scale-102'
                    }`}
                    style={{ borderRadius: idx % 3 === 0 ? '12px 8px 10px 8px' : idx % 3 === 1 ? '8px 12px 8px 10px' : '10px 8px 12px 8px' }}
                  >
                    <img className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} src={img} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Info */}
          <div style={{ animation: 'fadeUp 0.5s ease both' }} className="flex flex-col gap-6">
            <div>
              {/* Brand */}
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase' }}>Brand: {currentProduct.artist}</p>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-text-primary mb-2">
                {currentProduct.title}
              </h1>

              {/* Price badge */}
              <div className="font-display text-2xl font-black text-accent bg-transparent w-fit px-4 py-1 border-3 border-text-primary rounded-full hard-shadow mt-4">
                ${currentProduct.price.toFixed(2)} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>/ item</span>
              </div>
            </div>

            {/* Description */}
            {currentProduct.description && (
              <p className="font-sans text-lg text-text-secondary bg-card p-6 border-4 border-text-primary wobbly-border-2 hard-shadow">
                {currentProduct.description}
              </p>
            )}

            {/* Benefits List (Hand-drawn feel) */}
            <ul className="flex flex-col gap-4 font-mono text-sm text-text-primary">
              <li className="flex items-center gap-3 bg-transparent p-4 border-3 border-text-primary wobbly-border-1 hard-shadow font-extrabold uppercase">
                <span className="material-symbols-outlined text-accent-secondary font-black">done_outline</span>
                Guaranteed Weird Taste
              </li>
              <li className="flex items-center gap-3 bg-transparent p-4 border-3 border-text-primary wobbly-border-2 hard-shadow font-extrabold uppercase">
                <span className="material-symbols-outlined text-accent-secondary font-black">done_outline</span>
                100% Unidentifiable Proteins
              </li>
              <li className="flex items-center gap-3 bg-transparent p-4 border-3 border-text-primary wobbly-border-3 hard-shadow font-extrabold uppercase">
                <span className="material-symbols-outlined text-accent-secondary font-black">done_outline</span>
                Wiggles slightly when chewed
              </li>
            </ul>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>Select Quantity</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="hard-shadow" style={{
                    display: 'flex', alignItems: 'center',
                    border: '3px solid var(--text-primary)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                  }}>
                    <button onClick={() => setSelectedQty(q => Math.max(1, q - 1))} disabled={selectedQty <= 1}
                      style={{ width: 42, height: 42, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: selectedQty <= 1 ? 0.3 : 1 }}>
                      <Minus size={16} />
                    </button>
                    <span style={{ padding: '0 20px', fontWeight: 900, fontSize: 16, color: 'var(--text-primary)', minWidth: 32, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{selectedQty}</span>
                    <button onClick={() => setSelectedQty(q => Math.min(maxAddable, q + 1))} disabled={selectedQty >= maxAddable}
                      style={{ width: 42, height: 42, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: selectedQty >= maxAddable ? 0.3 : 1 }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {isAtMax && <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Cart limit reached</p>}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="pd-cta" style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                onClick={handleAddToCart}
                disabled={isAdded || isOutOfStock || isAtMax}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: isOutOfStock ? 'var(--bg-secondary)' : isAtMax ? 'rgba(245,158,11,0.15)' : isAdded ? 'rgba(29,185,84,0.15)' : 'var(--accent)',
                  color: isOutOfStock ? 'var(--text-muted)' : isAtMax ? 'var(--accent)' : isAdded ? 'var(--accent-secondary)' : 'var(--text-primary)',
                  border: `3px solid var(--text-primary)`,
                  padding: '16px 28px',
                  fontSize: 16, fontWeight: 900,
                  cursor: isOutOfStock || isAtMax ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-mono)',
                }}
                className={!isOutOfStock && !isAtMax && !isAdded ? 'wobbly-border-1 hard-shadow-hover' : ''}
              >
                <ShoppingBag size={18} />
                {isOutOfStock ? 'OUT OF STOCK' : isAtMax ? 'LIMIT REACHED' : isAdded ? 'ADDED!' : `ADD TO BOX — $${(currentProduct.price * selectedQty).toFixed(2)}`}
              </button>

              <button
                onClick={() => currentProduct && dispatch(toggleWishlist(currentProduct))}
                style={{
                  width: 52, height: 52,
                  borderRadius: 'var(--radius-md)',
                  border: '3px solid var(--text-primary)',
                  background: wished ? 'rgba(244,63,94,0.1)' : 'var(--bg-card)',
                  color: wished ? 'var(--warm-rose)' : 'var(--text-primary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                <Heart size={20} fill={wished ? 'var(--warm-rose)' : 'none'} />
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }} className="text-center">Warning: Do not feed after midnight.</p>

          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 80, paddingTop: 64, borderTop: '4px solid var(--text-primary)' }}>
            <FeaturedProducts
              products={relatedProducts}
              title="You Might Also Like"
              subtitle="Related Items"
              viewAllLink={cat.to}
              columns={4}
            />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pd-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .pd-image {
            position: static !important;
          }
        }
        @media (max-width: 480px) {
          .pd-cta {
            flex-direction: column !important;
          }
          .pd-cta button:first-child {
            order: 0;
          }
          .pd-cta button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;