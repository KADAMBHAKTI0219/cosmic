import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaEye, FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import power1 from '../../assets/images/power1.webp';
import power2 from '../../assets/images/power2.webp';
import power3 from '../../assets/images/power3.webp';
import power4 from '../../assets/images/power4.webp';
import power5 from '../../assets/images/power5.webp';
import power6 from '../../assets/images/power6.jpg';

const ProductGrid = ({ products }) => {
  // Sample products data if no products are provided
  const sampleProducts = [
    {
      id: 1,
      name: '5Wp 6V Polycrystalline Small Solar Module',
      image: power1,
      price: 499.00,
      originalPrice: 620.00,
      rating: 5,
      reviewCount: 6,
      inStock: true,
      discount: 20,
      freeShipping: true,
      description: 'Perfect for small DIY projects and educational purposes'
    },
    {
      id: 2,
      name: '60Wp 12V Small Solar PV Module',
      image: power2,
      price: 1899.00,
      originalPrice: 2150.00,
      rating: 4,
      reviewCount: 5,
      inStock: false,
      discount: 12,
      freeShipping: false,
      description: 'Ideal for charging 12V batteries and small off-grid systems'
    },
    {
      id: 3,
      name: 'WAAREE 120 Watt Mono PERC Solar Panel',
      image: power3,
      price: 3299.00,
      originalPrice: 4986.00,
      rating: 5,
      reviewCount: 6,
      inStock: true,
      discount: 36,
      freeShipping: true,
      description: 'High-efficiency panel for residential installations'
    },
    {
      id: 4,
      name: 'Premium Solar Inverter 1500W',
      image: power4,
      price: 12999.00,
      originalPrice: 14999.00,
      rating: 4,
      reviewCount: 12,
      inStock: true,
      discount: 13,
      freeShipping: true,
      description: 'Pure sine wave inverter for reliable power conversion'
    },
    {
      id: 5,
      name: 'Solar Battery 150Ah Deep Cycle',
      image: power5,
      price: 8499.00,
      originalPrice: 9999.00,
      rating: 4,
      reviewCount: 7,
      inStock: true,
      discount: 15,
      freeShipping: false,
      description: 'Long-lasting battery designed for solar energy storage'
    },
    {
      id: 6,
      name: 'Solar Panel Mounting Kit',
      image: power6,
      price: 2499.00,
      originalPrice: 2999.00,
      rating: 4,
      reviewCount: 6,
      inStock: true,
      discount: 17,
      freeShipping: true,
      description: 'Complete mounting solution for secure panel installation'
    }
  ];

  const displayProducts = products?.length > 0 ? products : sampleProducts;
  
  // State for wishlist
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (productId) => {
    setWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Function to render star ratings with better icons
  const renderRating = (rating, reviewCount) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return (
      <div className="flex items-center">
        <div className="flex text-sm">{stars}</div>
        <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  // Animation variants for product cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Small Solar Modules</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {displayProducts.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="border bg-white relative rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {/* Wishlist button */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 bg-white rounded-full p-1 sm:p-1.5 shadow-md opacity-80 hover:opacity-100 transition-opacity"
            >
              {wishlist[product.id] ? 
                <FaHeart className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" /> : 
                <FaRegHeart className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
              }
            </button>
            
            {/* Sale badge */}
            {product.discount && (
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold rounded z-10">
                On Sale
              </div>
            )}
            
            {/* Discount percentage */}
            {product.discount && (
              <div className="absolute top-0 right-0 bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs">
                {product.discount}% Off
              </div>
            )}
            
            {/* Out of stock badge */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <span className="bg-gray-800 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium">Out of Stock</span>
              </div>
            )}
            
            {/* Product image */}
            <Link to={`/product/${product.id}`}>
              <div className="h-36 sm:h-40 md:h-48 overflow-hidden bg-gray-100 flex items-center justify-center p-2 sm:p-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            
            {/* Product details */}
            <div className="p-3 sm:p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 line-clamp-2 h-8 sm:h-10">{product.name}</h3>
              </Link>
              
              {/* Short description */}
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div>
                  <span className="text-base sm:text-lg font-bold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Price drop message */}
              {product.discount && (
                <div className="text-xs text-gray-600 mb-1.5 sm:mb-2">
                  Price dropped by ₹{(product.originalPrice - product.price).toFixed(2)}
                </div>
              )}
              
              {/* Rating */}
              {renderRating(product.rating, product.reviewCount)}
              
              {/* Free shipping badge */}
              {product.freeShipping && (
                <div className="flex items-center text-xs text-blue-600 mt-1.5">
                  <FaTruck className="mr-1" />
                  <span>Free Shipping</span>
                </div>
              )}
              
              {/* Add to cart button */}
              <div className="mt-3 sm:mt-4">
                {product.inStock ? (
                  <button className="bg-green-600 hover:bg-green-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 w-full rounded-md transition-colors duration-200 flex items-center justify-center text-xs sm:text-sm">
                    <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Add To Cart
                  </button>
                ) : (
                  <button disabled className="bg-gray-300 text-gray-600 py-1.5 sm:py-2 px-3 sm:px-4 w-full cursor-not-allowed rounded-md text-xs sm:text-sm">
                    Out Of Stock
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;