import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/header';
import Footer from './layouts/footer';
import Navbar from './layouts/navbar';

import Home from './pages/home';
import Register from './pages/auth/register';
import Products from './components/products/products';
import ProductDetails from './components/products/productdetails';

// Auth Components
import Login from './components/auth/login';
import ForgotPassword from './components/auth/forgotPassword';
import VerifyOtp from './components/auth/verifyOtp';
import ResetPassword from './components/auth/resetPassword';
import AdminLogin from './pages/auth/AdminLogin';

// Admin Panel Components
import AdminRoutes from './components/admin-panel/AdminRoutes';

// Admin Auth Context
import { AdminAuthProvider } from './context/AdminAuthContext';

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            
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
                    
                    {/* Category Routes */}
                    <Route path="/solar-module" element={<Products />} />
                    <Route path="/solar-module/:subcategory" element={<Products />} />
                    <Route path="/solar-panel" element={<Products />} />
                    <Route path="/solar-panel/:subcategory" element={<Products />} />
                    <Route path="/solar-inverter" element={<Products />} />
                    <Route path="/solar-inverter/:subcategory" element={<Products />} />
                    <Route path="/solar-battery" element={<Products />} />
                    <Route path="/solar-battery/:subcategory" element={<Products />} />
                    <Route path="/solar-accessories" element={<Products />} />
                    <Route path="/solar-accessories/:subcategory" element={<Products />} />
                    
                    {/* Generic product category route */}
                    <Route path="/category/:category" element={<Products />} />
                    <Route path="/category/:category/:subcategory" element={<Products />} />
                    
                    {/* Product Details Route */}
                    <Route path="/product/:id" element={<ProductDetails />} />
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
