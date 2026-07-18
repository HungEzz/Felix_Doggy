import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      <Navbar />
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <Footer />

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden bg-secondary border-t-4 border-text-primary shadow-[0px_-4px_0px_0px_#8B9A46] rounded-t-xl" style={{ backgroundColor: 'var(--bg-secondary)', borderTopColor: 'var(--accent-secondary)' }}>
        <Link 
          to="/paws" 
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 transition-all duration-300 text-decoration-none ${
            isActive('/paws') 
              ? 'bg-accent text-text-primary scale-110 rotate-1 animate-bounce border-2 border-text-primary' 
              : 'text-text-primary opacity-80'
          }`}
        >
          <span className="material-symbols-outlined mb-1">pets</span>
          <span className="font-mono text-[10px] font-black">Paw</span>
        </Link>
        <Link 
          to="/bones" 
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 transition-all duration-300 text-decoration-none ${
            isActive('/bones') 
              ? 'bg-accent text-text-primary scale-110 rotate-1 border-2 border-text-primary' 
              : 'text-text-primary opacity-80'
          }`}
        >
          <span className="material-symbols-outlined mb-1">done</span>
          <span className="font-mono text-[10px] font-black">Bone</span>
        </Link>
        <Link 
          to="/cart" 
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 transition-all duration-300 text-decoration-none ${
            isActive('/cart') 
              ? 'bg-accent text-text-primary scale-110 rotate-1 border-2 border-text-primary' 
              : 'text-text-primary opacity-80'
          }`}
        >
          <span className="material-symbols-outlined mb-1">shopping_basket</span>
          <span className="font-mono text-[10px] font-black">Cart</span>
        </Link>
        <Link 
          to="/account" 
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 transition-all duration-300 text-decoration-none ${
            isActive('/account') 
              ? 'bg-accent text-text-primary scale-110 rotate-1 border-2 border-text-primary' 
              : 'text-text-primary opacity-80'
          }`}
        >
          <span className="material-symbols-outlined mb-1">face_6</span>
          <span className="font-mono text-[10px] font-black">Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default MainLayout;