import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaHeart, FaChevronLeft, FaChevronRight, FaStar, FaShoppingCart } from 'react-icons/fa';
import { productsApi } from '../../services/api';

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
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm">
        <FaHeart className="text-gray-300 hover:text-red-500 transition-colors" />
      </button>
      
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <span className="bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded">On Sale</span>
          <span className="bg-main text-white text-xs font-medium px-2 py-0.5 rounded">{discountPercentage}% OFF</span>
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative pt-[100%] overflow-hidden">
        <img 
          src={product.images && product.images.length > 0 
            ? `http://localhost:5000/${product.images[0]}` 
            : '/src/assets/images/placeholder.jpg'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 h-10">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline mb-1">
          <span className="text-lg font-bold text-gray-900">₹{product.price ? product.price.toLocaleString() : 0}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        {/* Shipping Info */}
        <p className="text-xs text-gray-500 mb-1">
          {product.freeShipping ? 'Free shipping' : 'Standard shipping'}
        </p>
        
        {/* Ratings */}
        <div className="flex items-center mb-3">
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
        
        {/* Button */}
        <button className="mt-auto w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-1.5 px-4 rounded-full text-sm transition-colors">
          Choose Options
        </button>
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
        setProducts(response.data.products || []);
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
    <section className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-8 lg:px-12 bg-white">
      <div className="container mx-auto">
        {/* Section Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left mb-4 sm:mb-6">Most Loved By Customers</h2>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {/* Products Swiper Slider */}
        {!loading && !error && products.length > 0 && (
          <div className="relative swiper-container most-loved-swiper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              centeredSlides={false}
              loop={false}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              navigation={false}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                el: '.swiper-pagination'
              }}
              breakpoints={{
                // when window width is >= 480px
                480: {
                  slidesPerView: 1,
                  spaceBetween: 16
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                // when window width is >= 1024px
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24
                }
              }}
              className="py-4 pb-12"
            >
              {products.map(product => (
                <SwiperSlide key={product._id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Pagination */}
            <div className="swiper-pagination mt-4"></div>
          </div>
        )}
        
        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostLoved;