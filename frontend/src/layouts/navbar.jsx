import React, { useState, useEffect } from 'react';
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
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <CosmicLogo isMobile={true} />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-4 flex-grow justify-center overflow-x-auto no-scrollbar">
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
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100">
                    {category.dropdown.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
            
            {/* User Icon (replaces Login button on mobile) */}
            <button 
              onClick={isLoggedIn ? handleLogout : toggleLogin} 
              className={`p-1 sm:p-2 ${isLoggedIn ? 'text-red-600 hover:text-red-700' : 'text-gray-700 hover:text-main'} rounded-full hover:bg-gray-100 lg:hidden`}
              aria-label={isLoggedIn ? "Logout" : "Login"}
            >
              {isLoggedIn ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </button>
            
            {/* Login/Logout Button (desktop only) */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hidden lg:flex ml-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 items-center text-sm">
                Logout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
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