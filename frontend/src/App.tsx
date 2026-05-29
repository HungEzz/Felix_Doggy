import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Vinyl from './pages/Vinyl';
import Checkout from './pages/Checkout';
import User from './pages/User';
import Merch from './pages/Merch';
import CD from './pages/CD';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import FAQ from './pages/FAQ';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
// Statistics pages
import RevenueStats from './pages/admin/statistics/RevenueStats';
import OrderStats from './pages/admin/statistics/OrderStats';
import ProductStats from './pages/admin/statistics/ProductStats';
import UserStats from './pages/admin/statistics/UserStats';
import InventoryStats from './pages/admin/statistics/InventoryStats';

import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import ChatBot from './components/ChatBot';

import { useDispatch } from 'react-redux';
import { fetchProducts } from './store/productSlice';
import { login, adminLogin } from './store/userSlice';
import type { AppDispatch } from './store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchProducts());

    // Restore user session
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        dispatch(
          login({
            id: user.id,
            name: user.name || user.fullName || '',
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            role: user.role,
          }),
        );
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Restore admin session (separate keys so two tabs don't conflict)
    const adminToken = localStorage.getItem('admin_token');
    const adminRaw = localStorage.getItem('admin_user');
    if (adminToken && adminRaw) {
      try {
        const admin = JSON.parse(adminRaw);
        dispatch(
          adminLogin({
            id: admin.id,
            name: admin.name || admin.fullName || '',
            email: admin.email,
            phone: admin.phone || '',
            address: admin.address || '',
            role: admin.role,
          }),
        );
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="vinyl" element={<Vinyl />} />
          <Route path="cd" element={<CD />} />
          <Route path="merch" element={<Merch />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shipping-returns" element={<ShippingReturns />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="account" element={<User />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN" redirectTo="/account">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          {/* Statistics routes */}
          <Route path="statistics/revenue" element={<RevenueStats />} />
          <Route path="statistics/orders" element={<OrderStats />} />
          <Route path="statistics/products" element={<ProductStats />} />
          <Route path="statistics/users" element={<UserStats />} />
          <Route path="statistics/inventory" element={<InventoryStats />} />
        </Route>
      </Routes>
      <ChatBot />
    </Router>
  );
};

export default App;