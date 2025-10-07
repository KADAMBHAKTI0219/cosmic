import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchModal from '../components/SearchModal';
import CartPopup from '../components/CartPopup';
import LoginModal from '../components/LoginModal';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset expanded category when closing menu
    if (isOpen) setExpandedCategory(null);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleCategoryExpand = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };
  
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined' && userData !== undefined) {
      try {
        const parsedData = userData === "undefined" ? null : JSON.parse(userData);
        if (parsedData) {
          setIsLoggedIn(true);
          setUser(parsedData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle invalid JSON by clearing localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, [isLoginOpen]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  // SVG for Cosmic logo
  const CosmicLogo = ({ isMobile }) => (
    <div className="flex items-center">
     <img 
       src="/src/assets/images/navbar-logo.png" 
       alt="Cosmic Logo" 
       className={isMobile ? "h-8 w-auto" : "h-10 w-auto"} 
     />
    </div>
  );

  // Product categories with dropdown items
  const categories = [
    { 
      name: 'Solar Module', 
      path: '/category/solar-module',
      dropdown: [
        { name: 'Solar Panel', path: '/category/solar-module/solar-panel' },
        { name: 'Small Solar Modules', path: '/category/solar-module/small-solar-modules' },
        { name: 'Flexible Solar Module', path: '/category/solar-module/flexible-solar-module' },
        { name: 'Mono PERC Solar Modules', path: '/category/solar-module/mono-perc-solar-modules' },
        { name: 'Bifacial Solar Modules', path: '/category/solar-module/bifacial-solar-modules' }
      ]
    },
    { 
      name: 'Solar Inverter', 
      path: '/category/solar-inverter',
      dropdown: [
        { name: 'Three Phase On Grid Inverter', path: '/category/solar-inverter/three-phase-on-grid-inverter' },
        { name: 'Single Phase On Grid Inverter', path: '/category/solar-inverter/single-phase-on-grid-inverter' }
      ]
    },
    { 
      name: 'Li-ion Battery', 
      path: '/category/li-ion-battery',
      dropdown: [
        { name: 'UPS Li-ion Battery Pack', path: '/category/li-ion-battery/ups-li-ion-battery-pack' },
        { name: 'Solar Street Light Li-ion Battery Pack', path: '/category/li-ion-battery/solar-street-light-li-ion-battery-pack' },
        { name: 'EV - 2 Wheeler Li-ion Battery Pack', path: '/category/li-ion-battery/ev-2-wheeler-li-ion-battery-pack' },
        { name: 'Residential and Commercial Storage Li-ion Battery', path: '/category/li-ion-battery/residential-commercial-storage-li-ion-battery' }
      ]
    },
    { name: 'Radiance Solar Kit', path: '/category/radiance-solar-kit' },
    { name: 'Save More', path: '/save-more' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <CosmicLogo isMobile={true} />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-3 justify-center max-w-4xl mx-auto">
            {/* Product Categories */}
            {categories.map((category, index) => (
              <div key={index} className="relative group">
                <Link 
                  to={category.path} 
                  className="px-2 xl:px-3 py-2 text-gray-700 hover:text-main flex items-center text-sm xl:text-base whitespace-nowrap"
                >
                  {category.name}
                  {category.dropdown && (
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
                
                {/* Dropdown Menu */}
                {category.dropdown && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-64 bg-white rounded-md shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 top-full">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-100"></div>
                    {category.dropdown.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-main transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile and Desktop Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search Icon */}
            <button 
              onClick={toggleSearch}
              className="p-1 sm:p-2 text-gray-700 hover:text-main rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Cart Icon with Count */}
            <div className="relative">
              <button 
                onClick={toggleCart}
                className="p-1 sm:p-2 text-gray-700 hover:text-main rounded-full hover:bg-gray-100 relative"
                aria-label="Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-main text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              {isCartOpen && <CartPopup isOpen={isCartOpen} onClose={toggleCart} />}
            </div>
            
            {/* User Icon (for mobile) */}
            <div className="lg:hidden">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={toggleMenu}
                    className="p-1 sm:p-2 text-gray-700 hover:text-main rounded-full hover:bg-gray-100"
                    aria-label="Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleLogin}
                  className="p-1 sm:p-2 text-gray-700 hover:text-main rounded-full hover:bg-gray-100"
                  aria-label="Login"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Profile Dropdown or Login Button (desktop only) */}
            {isLoggedIn ? (
              <div className="hidden lg:block relative group">
                <button className="flex items-center ml-2 px-3 py-1.5 bg-main text-white rounded-md hover:bg-main-dark text-sm">
                  {user?.name || 'Profile'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  {user?.role === 'admin' ? (
                    <>
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main">
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main">
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main">
                        Dashboard
                      </Link>
                      <Link to="/dashboard/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main">
                        My Orders
                      </Link>
                      <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main">
                        Profile
                      </Link>
                      <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main">
                        Settings
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-100">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={toggleLogin} className="hidden lg:flex ml-2 px-3 py-1.5 bg-main text-white rounded-md hover:bg-main-dark items-center text-sm">
                Login
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-1 sm:p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none lg:hidden"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`${isOpen ? 'block' : 'hidden'} lg:hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto`} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 bg-white border-t border-gray-200">
          {/* User Profile Section (if logged in) */}
          {isLoggedIn && (
            <div className="mb-3 px-3 py-2 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <div className="h-10 w-10 rounded-full bg-main text-white flex items-center justify-center mr-3">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
              
              {user?.role === 'admin' ? (
                <div className="space-y-1 mt-2">
                  <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-main" onClick={toggleMenu}>
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-main" onClick={toggleMenu}>
                    Settings
                  </Link>
                </div>
              ) : (
                <div className="space-y-1 mt-2">
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-main" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                  <Link to="/dashboard/my-orders" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-main" onClick={toggleMenu}>
                    My Orders
                  </Link>
                  <Link to="/dashboard/profile" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-main" onClick={toggleMenu}>
                    Profile
                  </Link>
                  <Link to="/dashboard/settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-main" onClick={toggleMenu}>
                    Settings
                  </Link>
                </div>
              )}
              
              <button onClick={() => {handleLogout(); toggleMenu();}} className="w-full mt-2 px-3 py-2 text-left rounded-md text-red-600 hover:bg-gray-100 hover:text-red-700">
                Logout
              </button>
            </div>
          )}
          
          {/* Product Categories in mobile view */}
          {categories.map((category, index) => (
            <div key={index} className="mb-1">
              <div className="flex items-center">
                <Link
                  to={category.path}
                  className="flex-grow px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => !category.dropdown && toggleMenu()}
                >
                  {category.name}
                </Link>
                {category.dropdown && (
                  <button
                    onClick={() => toggleCategoryExpand(index)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    aria-label={`Expand ${category.name} menu`}
                  >
                    <svg 
                      className={`h-4 w-4 transition-transform ${expandedCategory === index ? 'transform rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {category.dropdown && expandedCategory === index && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-3">
                  {category.dropdown.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} />
    </nav>
  );
};

export default Navbar;