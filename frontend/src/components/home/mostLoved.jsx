import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaHeart, FaChevronLeft, FaChevronRight, FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { productsApi } from '../../services/api';
import { fixImageUrl } from '../../utils/imageUtils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Product Card Component
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discount percentage if both prices are available
  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  // Check if product is on sale
  const isOnSale = discountPercentage > 0;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-full relative transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-all">
        <FaHeart className="text-gray-400 hover:text-red-500 transition-colors" />
      </button>
      
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <span className="bg-red-600 text-white text-xs font-medium px-2.5 py-1 rounded-md">Sale</span>
          <span className="bg-main text-white text-xs font-medium px-2.5 py-1 rounded-md">{discountPercentage}% OFF</span>
        </div>
      )}
      
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative pt-[100%] overflow-hidden bg-gray-100">
          <img 
            src={product.images && product.images.length > 0 
              ? fixImageUrl(product.images[0])
              : '/src/assets/images/placeholder.jpg'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/images/placeholder.jpg';
            }}
          />
          
          {/* Quick View Button (Shows on hover) */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300">
              <button className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-100 transition-colors">
                <FaEye /> Quick View
              </button>
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10 hover:text-main transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price ? product.price.toLocaleString() : 0}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        {/* Shipping Info */}
        <p className="text-xs text-gray-500 mb-2">
          {product.freeShipping ? 'Free shipping' : 'Standard shipping'}
        </p>
        
        {/* Ratings */}
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-xs ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
        </div>
        
        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <Link to={`/product/${product._id}`} className="flex-1">
            <button className="w-full bg-main hover:bg-main-dark text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
              View Details
            </button>
          </Link>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-md transition-colors">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

const MostLoved = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products with highest ratings
        const response = await productsApi.getAllProducts(1, 8, { sortBy: 'rating', sortOrder: 'desc' });
        console.log(response.data.data)
        if (response.data && response.data.success) {
          setProducts(response.data.data || []);
        } else {
          setProducts([]);
          setError('No products found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching most loved products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Most Loved By Customers</h2>
          <Link to="/products" className="text-main hover:text-main-dark font-medium flex items-center gap-1 transition-colors">
            View All <FaChevronRight className="text-xs" />
          </Link>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-main text-white px-4 py-2 rounded-md hover:bg-main-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Products Swiper Slider */}
        {!loading && !error && products.length > 0 && (
          <div className="relative swiper-container most-loved-swiper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              centeredSlides={false}
              loop={products.length > 4}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                el: '.swiper-pagination'
              }}
              breakpoints={{
                // when window width is >= 480px
                480: {
                  slidesPerView: 2,
                  spaceBetween: 16
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20
                },
                // when window width is >= 1024px
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24
                }
              }}
              className="py-4 pb-16"
            >
              {products.map(product => (
                <SwiperSlide key={product._id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
              
              {/* Custom Navigation Buttons */}
              <div className="swiper-button-prev !w-10 !h-10 !bg-white !shadow-md !rounded-full !text-gray-800 after:!text-sm"></div>
              <div className="swiper-button-next !w-10 !h-10 !bg-white !shadow-md !rounded-full !text-gray-800 after:!text-sm"></div>
            </Swiper>
            
            {/* Pagination */}
            <div className="swiper-pagination mt-6"></div>
          </div>
        )}
        
        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-medium">No products found.</p>
            <p className="text-gray-400 mt-2">Check back later for our most loved products!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostLoved;