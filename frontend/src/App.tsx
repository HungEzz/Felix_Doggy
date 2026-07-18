import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Bones from './pages/Bones';
import Checkout from './pages/Checkout';
import User from './pages/User';
import Toys from './pages/Toys';
import Paws from './pages/Paws';
import Clothes from './pages/Clothes';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import FAQ from './pages/FAQ';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
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
import NotFound from './pages/NotFound';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import ChatBot from './components/ChatBot';

import { useDispatch } from 'react-redux';
import { fetchProducts } from './store/productSlice';
import type { AppDispatch } from './store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 2000 }}
        containerStyle={{ bottom: '96px' }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="bones" element={<Bones />} />
          <Route path="paws" element={<Paws />} />
          <Route path="toys" element={<Toys />} />
          <Route path="clothes" element={<Clothes />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="shipping-returns" element={<ShippingReturns />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="order-tracking/:id" element={<OrderTracking />} />
          <Route path="order-tracking" element={<OrderTracking />} />
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

        {/* Catch-all 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatBot />
    </Router>
  );
};

export default App;