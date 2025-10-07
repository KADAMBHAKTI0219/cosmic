import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cartApi } from '../../services/api';
import { fixImageUrl } from '../../utils/imageUtils';

const ProductGrid = ({ products, loading }) => {
  console.log('Products in ProductGrid:', products);
  
  // Handle adding to cart
  const handleAddToCart = async (productId) => {
    try {
      await cartApi.addToCart({
        productId,
        quantity: 1
      });
      console.log(`Added product ${productId} to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Render loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Render no products message
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <h3 className="text-xl font-medium text-gray-700">No products found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }
  
  // Render actual products
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link to={`/product/${product._id}`} className="block relative">
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.images && product.images.length > 0 ? fixImageUrl(product.images[0]) : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
              {product.isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Out of Stock</span>
                </div>
              )}
            </div>
          </Link>
          
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <span key={i}>
                    {ratingValue <= product.rating ? (
                      <FaStar className="text-yellow-400" />
                    ) : ratingValue <= product.rating + 0.5 ? (
                      <FaStarHalfAlt className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-yellow-400" />
                    )}
                  </span>
                );
              })}
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description || 'No description available'}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xl font-bold text-gray-800">
                  ₹{product.price?.toLocaleString() || 0}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{product.originalPrice?.toLocaleString() || 0}
                  </span>
                )}
              </div>
              {product.freeShipping && (
                <span className="text-xs text-green-600 flex items-center">
                  <FaTruck className="mr-1" /> Free Shipping
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={product.isOutOfStock}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center ${
                  product.isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <FaShoppingCart className="mr-1" /> Add to Cart
              </button>
              <Link
                to={`/product/${product._id}`}
                className="py-2 px-3 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium flex items-center justify-center"
              >
                <FaEye className="mr-1" /> View
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ProductGrid;