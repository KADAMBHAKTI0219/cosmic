import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchModal from '../components/SearchModal';
import CartPopup from '../components/CartPopup';
import LoginModal from '../components/LoginModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

  // SVG for Cosmic logo
  const CosmicLogo = () => (
    <div className="flex items-center">
      <span style={{color: 'var(--main-color)'}} className="font-bold text-xl">WAAREE</span>
      <span className="text-xs text-gray-500 ml-1 hidden sm:inline">One with the Sun</span>
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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <CosmicLogo />
            </Link>
          </div>



          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4 flex-grow justify-center">
            {/* Product Categories */}
            {categories.map((category, index) => (
              <div key={index} className="relative group">
                <Link 
                  to={category.path} 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 flex items-center"
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
              className="p-1 sm:p-2 text-gray-700 hover:text-green-600 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Cart Icon with Count */}
            <div className="relative">
              <button 
                onClick={toggleCart}
                className="p-1 sm:p-2 text-gray-700 hover:text-green-600 rounded-full hover:bg-gray-100 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              {isCartOpen && <CartPopup isOpen={isCartOpen} onClose={toggleCart} />}
            </div>
            
            {/* User Icon (replaces Login button on mobile) */}
            <button 
              onClick={toggleLogin} 
              className="p-1 sm:p-2 text-gray-700 hover:text-green-600 rounded-full hover:bg-gray-100 md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Login Button (desktop only) */}
            <button onClick={toggleLogin} className="hidden md:flex ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 items-center">
              Login
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-1 sm:p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none md:hidden"
              aria-controls="mobile-menu"
              aria-expanded="false"
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
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {/* Product Categories in mobile view */}
          {categories.map((category, index) => (
            <div key={index}>
              <Link
                to={category.path}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                {category.name}
                {category.dropdown && (
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
              {category.dropdown && (
                <div className="pl-4 mt-1 space-y-1">
                  {category.dropdown.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
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