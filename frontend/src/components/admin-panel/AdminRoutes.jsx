import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import NotificationsManagement from './NotificationsManagement';
import ReportsManagement from './ReportsManagement';
import CategoryManagement from './CategoryManagement';

// Placeholder components
const InventoryManagement = () => <div>Inventory Management</div>;
const OffersManagement = () => <div>Offers Management</div>;
const CouponsManagement = () => <div>Coupons Management</div>;
const NewsletterManagement = () => <div>Newsletter Management</div>;
const ReviewsManagement = () => <div>Reviews Management</div>;
const WishlistAnalytics = () => <div>Wishlist Analytics</div>;
const EmiManagement = () => <div>EMI Management</div>;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="offers" element={<OffersManagement />} />
        <Route path="coupons" element={<CouponsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="newsletter" element={<NewsletterManagement />} />
        <Route path="notifications" element={<NotificationsManagement />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="wishlist" element={<WishlistAnalytics />} />
        <Route path="emi" element={<EmiManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;