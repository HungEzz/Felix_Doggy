import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent)', paddingTop: 40, paddingBottom: 24, marginTop: 'auto' }}>
      <div className="container-main">
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/image.png" alt="Felix Doggy Logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--accent)', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                Felix Doggy
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, maxWidth: 260 }}>
              Embrace the goofy, the wobbly, and the beautifully imperfect companions in your life. Normal is boring anyway.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { Icon: FaInstagram, href: '#' },
                { Icon: FaTwitter, href: '#' },
                { Icon: FaYoutube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: 42, height: 42,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translate(-2px, -2px) rotate(3deg)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '3px 3px 0px 0px var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/paws', label: 'Adopt a Dog' },
                { to: '/bones', label: 'Dog Food' },
                { to: '/toys', label: 'Dog Toys' },
                { to: '/clothes', label: 'Dog Clothes' },
                { to: '/cart', label: 'Your Box (Cart)' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/shipping-returns', label: 'Shipping & Delivery' },
                { to: '/faq', label: 'Manifest-no (FAQ)' },
                { to: '/account', label: 'Weirdo Dashboard' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Stay Strange</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { Icon: Mail, text: 'support@felixdoggy.com' },
                { Icon: Phone, text: '+84 123 Paw Paw' },
                { Icon: MapPin, text: '404 Weirdo Lane, Saigon, VN' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter mini */}
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Subscribe for weird updates</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    background: 'var(--bg-card)',
                    border: '2px solid var(--text-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                <button
                  style={{
                    background: 'var(--accent)',
                    border: '2px solid var(--text-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                  className="organic-brutalism-btn"
                >
                  <Heart size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="divider" style={{ borderColor: 'var(--text-primary)', borderWidth: 1 }} />

        {/* Bottom row */}
        <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>© {year} Felix Doggy. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/privacy" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 600 }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
              Privacy
            </Link>
            <Link to="/terms" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 600 }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
              Terms
            </Link>
            <Link to="/faq" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 600 }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
              Mascot Club
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
          footer > div > div:first-child > div:first-child {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 560px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;