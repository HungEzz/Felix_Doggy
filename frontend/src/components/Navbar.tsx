import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, X, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Navbar: React.FC = () => {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { isLoggedIn, profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/paws', label: 'Adopt a Dog' },
    { to: '/bones', label: 'Dog Food' },
    { to: '/toys', label: 'Dog Toys' },
    { to: '/clothes', label: 'Dog Clothes' },
    { to: '/about', label: 'About Us' },
    { to: '/faq', label: 'FAQ' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          background: 'var(--bg-primary)',
          borderBottom: '2px solid var(--accent-secondary)',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="navbar-inner"
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          {/* Logo Container */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <img src="/image.png" alt="Felix Doggy Logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--accent)',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                transition: 'transform 0.2s',
              }}
              className="hover:rotate-2 hover:scale-105"
              >
                Felix Doggy
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isActive(to) ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'rotate(2deg) scale(1.05)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.color = isActive(to) ? 'var(--accent)' : 'var(--text-secondary)';
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flex: 1, justifyContent: 'flex-end' }}>
            <Link to="/account" style={{ display: 'flex' }}>
              <button className="btn-icon btn" title="Account"
                style={{ border: '2px solid var(--text-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                {isLoggedIn && profile ? (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                ) : (<User size={18} />)}
              </button>
            </Link>
            <Link to="/cart" style={{ display: 'flex', textDecoration: 'none' }}>
              <button className="organic-brutalism-btn bg-accent text-text-primary px-4 py-2 flex items-center gap-2"
                style={{ borderRadius: 'var(--radius-md)', height: 42, background: 'var(--accent)' }}>
                <ShoppingBag size={18} style={{ color: 'var(--text-primary)' }} />
                {cartItemCount > 0 ? (
                  <span style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '2px solid var(--text-primary)', borderRadius: '50%', width: 22, height: 22, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartItemCount}
                  </span>
                ) : (
                  <span className="cart-label" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Cart</span>
                )}
              </button>
            </Link>
            <button className="btn-icon btn mobile-menu-btn" onClick={() => setMobileOpen(o => !o)}
              style={{ border: '2px solid var(--text-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div style={{ position: 'fixed', top: 72, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', zIndex: 99, overflowY: 'auto', animation: 'fadeIn 0.2s ease', borderTop: '2px solid var(--text-primary)' }}>
            <div style={{ padding: '16px' }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}
                    style={{
                      padding: '14px 16px',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      display: 'block',
                      fontSize: 16,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isActive(to) ? 'var(--accent)' : 'var(--text-secondary)',
                      border: '2px solid var(--text-primary)',
                      background: isActive(to) ? 'var(--bg-secondary)' : 'var(--bg-card)'
                    }}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      <div style={{ height: 72 }} />

      <style>{`
        .navbar-inner { padding: 0 32px; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 1024px) {
          .navbar-inner { padding: 0 12px; }
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .desktop-search-btn { display: none !important; }
          .desktop-spacer { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .cart-label { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;