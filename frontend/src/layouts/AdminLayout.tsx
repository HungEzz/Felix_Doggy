import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  BarChart3,
  ChevronDown,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Boxes,
  Menu,
  X,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../store/userSlice';
import toast from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [statsOpen, setStatsOpen] = useState(
    location.pathname.startsWith('/admin/statistics')
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    dispatch(adminLogout());
    toast.success('Admin logged out', { duration: 2000 });
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { name: 'Customers', path: '/admin/users', icon: <Users size={18} /> },
  ];

  const statsItems = [
    { name: 'Revenue', path: '/admin/statistics/revenue', icon: <DollarSign size={15} /> },
    { name: 'Orders', path: '/admin/statistics/orders', icon: <ShoppingBag size={15} /> },
    { name: 'Products', path: '/admin/statistics/products', icon: <Package size={15} /> },
    { name: 'Customers', path: '/admin/statistics/users', icon: <UserCheck size={15} /> },
    { name: 'Inventory', path: '/admin/statistics/inventory', icon: <Boxes size={15} /> },
  ];

  const isStatsActive = location.pathname.startsWith('/admin/statistics');

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#f5ede0]">
      {/* Logo & Header */}
      <div 
        className="px-6 py-6 mb-6 flex items-center gap-4 cursor-pointer border-b-4 border-[#1e1b14]"
        onClick={() => window.open('/', '_blank')}
        title="Open homepage (new tab)"
      >
        <div className="w-12 h-12 bg-[#daeb8d] rounded-full border-2 border-[#1e1b14] flex items-center justify-center blob-border shrink-0 overflow-hidden shadow-sm">
          <img 
            className="w-full h-full object-cover" 
            alt="Admin Mascot" 
            src="/image.png" 
          />
        </div>
        <div>
          <h1 className="font-sans text-sm font-black text-[#ab3500] leading-tight uppercase tracking-wide">Felix Doggy</h1>
          <p className="font-mono text-[9px] text-[#594139] uppercase font-bold tracking-widest mt-0.5">Management Portal</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            onClick={closeSidebar}
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-xl border-2 py-3 px-4 transition-all duration-150 font-bold ${
                isActive 
                  ? 'bg-[#ff6b35] text-white border-[#1e1b14] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#1e1b14]' 
                  : 'text-[#594139] border-transparent hover:bg-[#e9e2d5] hover:rotate-1 hover:scale-102 hover:border-[#1e1b14]/10'
              }`
            }
          >
            {item.icon}
            <span className="font-mono text-xs uppercase tracking-wider">{item.name}</span>
          </NavLink>
        ))}

        {/* Statistics dropdown inside sidebar */}
        <div className="pt-2 border-t-2 border-[#1e1b14]/10">
          <div className="px-4 py-1.5">
            <span className="font-mono text-[9px] font-black tracking-widest text-[#594139] uppercase opacity-75">
              Analytics
            </span>
          </div>

          <button
            onClick={() => setStatsOpen((o) => !o)}
            className={`w-full flex items-center gap-3 rounded-xl border-2 py-3 px-4 transition-all duration-150 font-bold text-left cursor-pointer bg-transparent ${
              isStatsActive
                ? 'border-[#1e1b14] text-[#1e1b14] bg-[#e9e2d5]'
                : 'border-transparent text-[#594139] hover:bg-[#e9e2d5]'
            }`}
          >
            <BarChart3 size={18} />
            <span className="font-mono text-xs uppercase tracking-wider flex-grow">Stats Reports</span>
            <ChevronDown
              size={14}
              style={{
                transition: 'transform 0.25s ease',
                transform: statsOpen ? 'rotate(180deg)' : 'none',
              }}
            />
          </button>

          <div
            style={{
              overflow: 'hidden',
              maxHeight: statsOpen ? '280px' : '0px',
              transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <div className="pl-4 pr-1 py-2 flex flex-col gap-1.5">
              {statsItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => 
                    `flex items-center gap-2.5 py-2 px-3.5 rounded-lg border transition-all font-semibold ${
                      isActive 
                        ? 'text-[#ab3500] bg-[#ffdbd0]/40 border-[#ab3500]/30 font-bold' 
                        : 'text-[#594139] border-transparent hover:bg-[#e9e2d5]/60'
                    }`
                  }
                >
                  <span className="opacity-75">{item.icon}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout container */}
      <div className="px-4 py-4 mt-auto space-y-4 border-t-2 border-[#1e1b14]/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border-2 border-transparent text-[#ef4444] hover:bg-[#ef4444]/10 font-bold cursor-pointer transition-all"
        >
          <LogOut size={18} />
          <span className="font-mono text-xs uppercase tracking-wider">Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fff8f0', fontFamily: "'Work Sans', sans-serif" }}>
      {/* Mobile header bar */}
      <div className="admin-mobile-header" style={{
        display: 'none',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 56,
        background: '#f5ede0',
        borderBottom: '4px solid #1e1b14',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        zIndex: 200,
      }}>
        <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e1b14', display: 'flex', padding: 8 }}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="font-sans font-black text-sm text-[#1e1b14] uppercase tracking-wider">Felix Doggy Admin</span>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay"
          onClick={closeSidebar}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 299,
          }}
        />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 256,
        background: '#f5ede0',
        borderRight: '4px solid #1e1b14',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '4px 0px 0px 0px #576415',
        zIndex: 300,
      }}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="admin-main flex-1 flex flex-col min-h-screen" style={{ overflowY: 'auto', background: '#fff8f0' }}>
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-[#fff8f0]/80 backdrop-blur-sm w-full border-b-4 border-[#1e1b14] flex-shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e1b14' }} className="flex p-1">
              <Menu size={24} />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className="font-sans text-lg font-black text-[#1e1b14] uppercase tracking-wide">Felix Doggy Admin Portal</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <input 
                className="bg-[#e9e2d5] border-2 border-[#1e1b14] rounded-full py-2 pl-4 pr-10 font-mono text-xs focus:outline-none focus:border-[#ab3500] w-64 placeholder-[#594139]/70 text-[#1e1b14]" 
                placeholder="Search weirdness..." 
                type="text"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#1e1b14] pointer-events-none">search</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[#594139] hover:text-[#576415] hover:scale-110 active:scale-95 transition-all bg-transparent border-0 cursor-pointer flex">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-[#594139] hover:text-[#576415] hover:scale-110 active:scale-95 transition-all bg-transparent border-0 cursor-pointer flex">
                <span className="material-symbols-outlined">mail</span>
              </button>
              <button className="text-on-surface-variant hover:text-secondary hover:jiggle transition-all scale-95 active:scale-90 w-10 h-10 rounded-full border-2 border-[#1e1b14] overflow-hidden blob-border bg-white cursor-pointer p-0 flex shrink-0 border-solid">
                <img 
                  className="w-full h-full object-cover" 
                  alt="CWO Avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjE9fdbJw7VDtKHmlS7-fbZul_Os69qYalq4PBaALpsynSJ9fO4zWMHE-LmZcb2pX-YNgsKpytf1-0rohe0LjUkqRlI74U3nRCWbVrrbbRQi9KNddYTj5zm1zdJhm0ywae9iUXFfnp741zvtxxh_qh5cE_fquKh7DWNC1AvGGwsxCtvIs7ytTzjwlQur9bt4Q6LlrI6c81Wm-EvRyAOwAstf2ezCIrwgyilcVA3slpOJ5Qm6aE2SOeAwZTy0ESPkPdhTz0VTUxvqY" 
                />
              </button>
            </div>
          </div>
        </header>

        <div style={{ padding: '32px 36px', minHeight: '100%', flex: 1 }} className="bg-[#fff8f0]">
          <Outlet />
        </div>
      </main>

      <style>{`
        .blob-border {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .blob-card-border {
            border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .jiggle:hover {
            transform: scale(1.02) rotate(1deg);
        }
        .drawn-line {
            background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1 Q 10 0 20 1 T 40 1 T 60 1 T 80 1 T 100 1' stroke='%231e1b14' stroke-width='2' fill='none' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E");
            background-repeat: repeat-x;
            height: 2px;
        }

        @media (max-width: 768px) {
          .admin-mobile-header {
            display: flex !important;
          }
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 300 !important;
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .admin-sidebar-overlay {
            display: block !important;
          }
          .admin-main {
            margin-top: 56px !important;
          }
          .admin-main > div {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;