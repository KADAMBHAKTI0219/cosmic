import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import UserManagement from './userManagement';
import OrderManagement from './orderManagement';
import ProductManagement from './ProductManagement';

// Placeholder components for other admin sections
const CategoryManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Category Management</h1><p>Category management interface will be implemented here.</p></div>;
const InventoryManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Inventory Management</h1><p>Inventory management interface will be implemented here.</p></div>;
const OffersManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Offers Management</h1><p>Offers management interface will be implemented here.</p></div>;
const CouponsManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Coupons Management</h1><p>Coupons management interface will be implemented here.</p></div>;
const ReportsManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Reports</h1><p>Reports interface will be implemented here.</p></div>;
const NewsletterManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Newsletter Management</h1><p>Newsletter management interface will be implemented here.</p></div>;
const NotificationsManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Notifications Management</h1><p>Notifications management interface will be implemented here.</p></div>;
const ReviewsManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Reviews Management</h1><p>Reviews management interface will be implemented here.</p></div>;
const WishlistAnalytics = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">Wishlist Analytics</h1><p>Wishlist analytics interface will be implemented here.</p></div>;
const EmiManagement = () => <div className="p-6 bg-white rounded-lg shadow-md"><h1 className="text-2xl font-bold mb-6">EMI Options Management</h1><p>EMI options management interface will be implemented here.</p></div>;

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