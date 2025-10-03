import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductSidebar from './productsidebar';
import ProductGrid from './productgrid';
import { FaFilter, FaTimes, FaSort, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    price: { min: '', max: '' },
    inStock: false,
    rating: null
  });

  // Sample product data - expanded for better demonstration
  const sampleProducts = [
    {
      id: 1,
      name: '5Wp 6V Polycrystalline Small Solar Module',
      image: 'https://m.media-amazon.com/images/I/71Yd6pKiDiL._AC_UF1000,1000_QL80_.jpg',
      price: 499.00,
      originalPrice: 620.00,
      rating: 5,
      reviewCount: 6,
      inStock: true,
      discount: 20,
      category: 'solar-module',
      description: 'Perfect for small DIY projects and educational purposes'
    },
    {
      id: 2,
      name: '60Wp 12V Small Solar PV Module',
      image: 'https://m.media-amazon.com/images/I/61mV3-qqhML._AC_UF1000,1000_QL80_.jpg',
      price: 1899.00,
      originalPrice: 2150.00,
      rating: 4,
      reviewCount: 5,
      inStock: false,
      discount: 12,
      category: 'solar-module',
      description: 'Ideal for charging 12V batteries and small off-grid systems'
    },
    {
      id: 3,
      name: 'WAAREE 120 Watt Mono PERC Solar Panel',
      image: 'https://m.media-amazon.com/images/I/71Yd6pKiDiL._AC_UF1000,1000_QL80_.jpg',
      price: 3299.00,
      originalPrice: 4986.00,
      rating: 5,
      reviewCount: 6,
      inStock: true,
      discount: 36,
      category: 'solar-panel',
      description: 'High-efficiency panel for residential installations'
    },
    {
      id: 4,
      name: 'WAAREE 550 Watt Bifacial Solar Panel',
      image: 'https://m.media-amazon.com/images/I/61mV3-qqhML._AC_UF1000,1000_QL80_.jpg',
      price: 8999.00,
      originalPrice: 12500.00,
      rating: 5,
      reviewCount: 12,
      inStock: true,
      discount: 28,
      category: 'solar-panel',
      description: 'Premium bifacial panel for maximum energy harvest'
    },
    {
      id: 5,
      name: 'Solar Charge Controller 30A MPPT',
      image: 'https://m.media-amazon.com/images/I/71Yd6pKiDiL._AC_UF1000,1000_QL80_.jpg',
      price: 2499.00,
      originalPrice: 3200.00,
      rating: 4.5,
      reviewCount: 18,
      inStock: true,
      discount: 22,
      category: 'solar-accessory',
      description: 'Advanced MPPT controller for optimal charging efficiency'
    },
    {
      id: 6,
      name: 'Solar Panel Mounting Kit for Roof',
      image: 'https://m.media-amazon.com/images/I/61mV3-qqhML._AC_UF1000,1000_QL80_.jpg',
      price: 1299.00,
      originalPrice: 1599.00,
      rating: 4,
      reviewCount: 7,
      inStock: true,
      discount: 19,
      category: 'solar-accessory',
      description: 'Complete mounting solution for secure panel installation'
    }
  ];

  // Fetch products based on category and filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Simulate API call with delay
        setTimeout(() => {
          // Filter products based on category if provided
          let filteredProducts = sampleProducts;
          
          if (category) {
            filteredProducts = filteredProducts.filter(
              product => product.category === category
            );
          }

          // Apply search filter if query exists
          if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
              product.name.toLowerCase().includes(query) || 
              product.description.toLowerCase().includes(query)
            );
          }

          // Apply price filter if set
          if (filters.price.min !== '' || filters.price.max !== '') {
            filteredProducts = filteredProducts.filter(product => {
              const minPrice = filters.price.min !== '' ? parseFloat(filters.price.min) : 0;
              const maxPrice = filters.price.max !== '' ? parseFloat(filters.price.max) : Infinity;
              return product.price >= minPrice && product.price <= maxPrice;
            });
          }

          // Apply in-stock filter if set
          if (filters.inStock) {
            filteredProducts = filteredProducts.filter(product => product.inStock);
          }

          // Apply rating filter if set
          if (filters.rating) {
            filteredProducts = filteredProducts.filter(product => product.rating >= filters.rating);
          }

          // Apply sorting
          if (sortOption === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
          } else if (sortOption === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
          } else if (sortOption === 'rating') {
            filteredProducts.sort((a, b) => b.rating - a.rating);
          } else if (sortOption === 'discount') {
            filteredProducts.sort((a, b) => b.discount - a.discount);
          }
          // 'featured' sorting is default

          setProducts(filteredProducts);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, filters, sortOption, searchQuery]);

  const handleFilterChange = (filterData) => {
    if (filterData.type === 'price') {
      setFilters(prev => ({
        ...prev,
        price: filterData.value
      }));
    } else if (filterData.type === 'stock') {
      setFilters(prev => ({
        ...prev,
        inStock: filterData.value
      }));
    } else if (filterData.type === 'rating') {
      setFilters(prev => ({
        ...prev,
        rating: filterData.value
      }));
    }
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already handled in the useEffect
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {category ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'All Products'}
          </h1>
          
          {/* Breadcrumb navigation */}
          <nav className="flex py-2 overflow-x-auto" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 sm:space-x-3 whitespace-nowrap">
              <li className="inline-flex items-center">
                <a href="/" className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  <span className="text-sm sm:text-base font-medium">Home</span>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <a href="/solar-module" className="ml-1 text-sm sm:text-base text-gray-700 hover:text-green-600 sm:ml-2 font-medium transition-colors">Solar Module</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm sm:text-base text-gray-500 sm:ml-2 font-medium">Small Solar Modules</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Search and Sort Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Search Bar */}
            <div className="flex-grow">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </form>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaSort className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={toggleMobileFilters}
              className="md:hidden flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <FaFilter className="mr-2" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          {/* Mobile Filters Sidebar */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed inset-0 z-50 md:hidden"
              >
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileFilters}></div>
                <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={toggleMobileFilters} className="text-gray-500 hover:text-gray-700">
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-grow overflow-y-auto p-4">
                    <ProductSidebar onFilterChange={handleFilterChange} />
                  </div>
                  <div className="p-4 border-t">
                    <button
                      onClick={toggleMobileFilters}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar with filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
              <ProductSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Product grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-500 animate-pulse">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductGrid products={products} />
                
                {/* Results summary */}
                <div className="bg-white rounded-lg shadow-sm p-4 mt-4 text-center text-gray-600">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">
                  <FaSearch className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      price: { min: '', max: '' },
                      inStock: false,
                      rating: null
                    });
                    setSearchQuery('');
                    setSortOption('featured');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-colors inline-flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;