import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaHeart, FaChevronLeft, FaChevronRight, FaStar, FaShoppingCart } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Sample product data based on the image
const mostLovedProducts = [
  {
    id: 1,
    name: 'WAAREE Black/Blue 365Wp 100 Cells Mono PERC Solar Panel',
    image: '/src/assets/images/image4.jfif',
    currentPrice: 4599,
    originalPrice: 10399.31,
    rating: 5,
    reviewCount: 5,
    isOnSale: true,
    discountPercentage: 56,
    freeShipping: true,
    shippingDate: '10/28'
  },
  {
    id: 2,
    name: 'WAAREE 5kW Single Phase Solar On Grid Inverter',
    image: '/src/assets/images/image2.jfif',
    currentPrice: 27499,
    originalPrice: 47206.25,
    rating: 4.5,
    reviewCount: 11,
    isOnSale: true,
    discountPercentage: 42,
    freeShipping: true,
    shippingDate: '10/28'
  },
  {
    id: 3,
    name: 'WAAREE Black/Blue 395Wp 132 Cells Mono PERC Solar Panel',
    image: '/src/assets/images/image3.jfif',
    currentPrice: 4999,
    originalPrice: 7699,
    rating: 5,
    reviewCount: 1,
    isOnSale: true,
    discountPercentage: 35,
    freeShipping: true,
    shippingDate: '10/28'
  },
  {
    id: 4,
    name: 'WAAREE Radiance 3 kW On Grid Single Phase Bifacial Topcon DCR Solar Kit',
    image: '/src/assets/images/image1.jpg',
    currentPrice: 133899,
    originalPrice: 178124.06,
    rating: 5,
    reviewCount: 16,
    isOnSale: true,
    discountPercentage: 25,
    freeShipping: true,
    shippingDate: '10/28'
  }
];

// Product Card Component
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
      {product.isOnSale && (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <span className="bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded">On Sale</span>
          <span className="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded">{product.discountPercentage}% OFF</span>
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative pt-[100%] overflow-hidden">
        <img 
          src={product.image} 
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
          <span className="text-lg font-bold text-gray-900">₹{product.currentPrice.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        {/* Shipping Info */}
        {product.freeShipping && (
          <p className="text-xs text-gray-500 mb-1">
            Free shipping by {product.shippingDate}
          </p>
        )}
        
        {/* Ratings */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
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
  return (
    <section className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-8 lg:px-12 bg-white">
      <div className="container mx-auto">
        {/* Section Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left mb-4 sm:mb-6">Most Loved By Customers</h2>
        
        {/* Products Swiper Slider */}
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
            {mostLovedProducts.map(product => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Navigation buttons removed */}
          
          {/* Pagination */}
          <div className="swiper-pagination mt-4"></div>
        </div>
      </div>
    </section>
  );
};

export default MostLoved;