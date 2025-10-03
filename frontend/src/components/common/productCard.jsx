import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    image,
    currentPrice,
    originalPrice,
    discount,
    rating,
    reviewCount,
    isBestseller,
    isOnSale,
    discountPercentage,
  } = product;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Product Tags */}
      <div className="absolute top-0 left-0 z-10 flex">
        {isBestseller && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1">
            Bestseller
          </span>
        )}
        {isOnSale && (
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 ml-1">
            On Sale
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 ml-1">
            {discountPercentage}% Off
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm text-gray-400 hover:text-red-500 transition-colors duration-300">
        <FaHeart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <Link to={`/product/${id}`}>
        <div className="h-48 overflow-hidden bg-gray-50 p-2">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-2">
          <span className="text-lg font-bold">₹{currentPrice.toLocaleString()}</span>
          {originalPrice > currentPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Price dropped info */}
        {discount > 0 && (
          <p className="text-xs text-red-500 mb-2">
            Price dropped by ₹{discount.toLocaleString()}
          </p>
        )}

        {/* Ratings */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
        </div>

        {/* Action Button */}
        {product.inStock ? (
          <button 
            style={{backgroundColor: 'var(--main-color)'}}
            className="w-full py-2 text-white font-medium rounded hover:brightness-90 transition-all duration-300"
          >
            Add To Cart
          </button>
        ) : (
          <button 
            className="w-full py-2 text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            Choose Options
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;