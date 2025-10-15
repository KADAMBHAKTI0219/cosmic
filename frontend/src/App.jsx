import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/header';
import Footer from './layouts/footer';
import Navbar from './layouts/navbar';
import ScrollToTop from './components/common/ScrollToTop';

import Home from './pages/home';
import Register from './pages/auth/register';
import ProductList from './pages/products/ProductList';
import CartPage from './components/products/CartPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderConfirmationPage from './pages/orders/OrderConfirmationPage';
import OrderDetailsPage from './pages/orders/OrderDetailsPage';
import OrderPendingPage from './pages/orders/OrderPendingPage';
import PendingOrderPage from './pages/orders/PendingOrderPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import ReviewForm from './pages/reviews/ReviewForm';
import NotificationsPage from './pages/notifications/NotificationsPage';
import EMIPage from './pages/emi/EMIPage';

// Auth Components
import Login from './components/auth/login';
import ForgotPassword from './components/auth/forgotPassword';
import VerifyOtp from './components/auth/verifyOtp';
import ResetPassword from './components/auth/resetPassword';
import AdminLogin from './pages/auth/AdminLogin';

// Admin Panel Components
import AdminRoutes from './components/admin-panel/AdminRoutes';
import OrderReviewPage from './pages/admin/OrderReviewPage';

// Dashboard Components
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyOrders from './pages/dashboard/MyOrders';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import OrderDetails from './pages/dashboard/OrderDetails';

// Admin Auth Context
import { AdminAuthProvider } from './context/AdminAuthContext';
import CheckoutPage from './components/products/CheckoutPage';
import ProductDetails from './components/products/productdetails';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AdminAuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/orders/review/:id" element={<OrderReviewPage />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <>
                <DashboardLayout />
              </>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Header />
                <Navbar/>
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/verify-otp" element={<VerifyOtp />} />
                    <Route path="/auth/verify-otp/:token" element={<VerifyOtp />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    
               
                  <Route path="/products" element={<ProductList/>}/>
                    
                    {/* Product Details Route */}
                    <Route path="/product/:id" element={<ProductDetails />} />
                    
                    {/* Cart Route */}
                    <Route path="/cart" element={<CartPage />} />
                    
                    {/* Checkout Route */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    
                    {/* Order Routes */}
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/order-confirmation/:orderId/:token" element={<OrderConfirmationPage />} />
                    <Route path="/orders/:id" element={<OrderDetailsPage />} />
                    <Route path="/order-pending/:orderId" element={<OrderPendingPage />} />
                    <Route path="/pending-order/:orderId" element={<PendingOrderPage />} />
                    
                    {/* Review Routes */}
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/reviews/edit/:id" element={<ReviewForm />} />
                    <Route path="/reviews/new/:productId" element={<ReviewForm />} />
                    
                    {/* Notification Routes */}
                    <Route path="/notifications" element={<NotificationsPage />} />
                    
                    {/* EMI Routes */}
                    <Route path="/emi" element={<EMIPage />} />
                    
                    {/* Products Page */}
                    <Route path="/products" element={<ProductList />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
