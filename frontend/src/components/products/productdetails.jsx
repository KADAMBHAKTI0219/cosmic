import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productsApi, cartApi, reviewApi } from '../../services/api';
import power1 from '../../assets/images/power1.webp';
import power2 from '../../assets/images/power2.webp';
import power3 from '../../assets/images/power3.webp';
import power4 from '../../assets/images/power4.webp';
import power5 from '../../assets/images/power5.webp';
import power6 from '../../assets/images/power6.jpg';
import { FaHeart, FaShareAlt, FaShippingFast, FaShieldAlt,FaSun ,FaLeaf, FaRegCreditCard, FaTruck, FaBox, FaChartLine, FaMedal, FaAward, FaCheck, FaStar, FaListUl, FaFileAlt, FaDownload, FaPencilAlt, FaBoxOpen, FaArrowRight, FaChevronDown, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt, FaInfoCircle, FaUserShield, FaStore, FaMapMarkerAlt, FaQuestionCircle, FaRegHeart } from 'react-icons/fa';
import { fixImageUrl } from '../../utils/imageUtils';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const zoomRef = useRef(null);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await productsApi.getProductById(id);
        console.log(response.data.data)
        if (response.data && response.data.success) {
          setProduct(response.data.data);
          
          // Fetch related products
          try {
            const relatedResponse = await productsApi.getAllProducts(1, 4, {
              category: response.data.data.categoryId?._id
            });
            if (relatedResponse.data && relatedResponse.data.success) {
              // Make sure we have an array and filter out the current product
              const relatedProductsData = relatedResponse.data.data || [];
              setRelatedProducts(relatedProductsData.filter(p => p._id !== id));
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
          }
          
          // Fetch reviews for this product
          try {
            const reviewsResponse = await reviewApi.getProductReviews(id);
            if (reviewsResponse.data && reviewsResponse.data.success) {
              setReviews(reviewsResponse.data.reviews || []);
            }
          } catch (reviewError) {
            console.error('Error fetching reviews:', reviewError);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Handle add to cart and wishlist functionality is defined below

  // If loading, show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Use actual product data or fallback to sample data
  const productData = product || {
    id: 1,
    name: 'WAAREE 100 Watt Mono PERC Solar Panel',
    price: 4199.00,
    originalPrice: 4630.00,
    discount: 431.00,
    rating: 5,
    reviewCount: 6,
    inStock: "true",
    sku: 'SOLAR-100WP-12V',
    description: 'High-efficiency monocrystalline PERC solar panel perfect for residential and commercial applications. This 100W 12V module is ideal for charging batteries and powering small to medium devices.',
    features: [
      'Power Output: 100Wp',
      'Voltage: 12V',
      'Cell Type: Monocrystalline PERC',
      'Dimensions: 1020mm x 670mm x 35mm',
      'Weight: 8kg',
      'Warranty: 25 years performance, 10 years product'
    ],
    images: [power1, power2, power3, power4, power5, power6],
    applications: [
      { name: 'Solar System', icon: 'FaSolarPanel' },
      { name: 'Home', icon: 'FaHome' },
      { name: 'RV & Boat', icon: 'FaShip' },
      { name: 'Off-Grid', icon: 'FaLightbulb' }
    ],
    emiOptions: [
      { months: 3, amount: 1400, bank: 'HDFC' },
      { months: 6, amount: 700, bank: 'ICICI' },
      { months: 9, amount: 467, bank: 'SBI' },
      { months: 12, amount: 350, bank: 'Axis' },
      { months: 18, amount: 234, bank: 'HDFC' },
      { months: 24, amount: 175, bank: 'ICICI' }
    ],
    relatedProducts: [
      { id: 2, name: 'WAAREE 150W Solar Panel', price: 6199, originalPrice: 6999, image: power2 },
      { id: 3, name: 'Luminous 100W Flexible Panel', price: 5299, originalPrice: 5999, image: power3 },
      { id: 4, name: 'Loom Solar 120W Panel', price: 5499, originalPrice: 6299, image: power4 }
    ],
    comparisonProducts: [
      { id: 5, name: 'WAAREE 100W Mono', price: 4199, efficiency: '21.6%', weight: '8 kg', warranty: '25 years', image: power1 },
      { id: 6, name: 'Luminous 100W Poly', price: 3999, efficiency: '19.2%', weight: '8.5 kg', warranty: '15 years', image: power3 },
      { id: 7, name: 'Loom 100W Mono PERC', price: 4299, efficiency: '21.8%', weight: '7.8 kg', warranty: '25 years', image: power4 },
      { id: 8, name: 'Vikram 100W Poly', price: 3899, efficiency: '18.5%', weight: '9 kg', warranty: '10 years', image: power5 }
    ]
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle image change
  const handleImageChange = (index) => {
    setActiveImage(index);
  };
  
  // Add to cart
  const handleAddToCart = async () => {
    try {
      const response = await cartApi.addToCart({
        productId: id,
        quantity: quantity
      });
      
      if (response.data && response.data.success) {
        // Show success toast notification
        toast.success('Product added to cart successfully!');
        console.log(`Added ${quantity} of product ${id} to cart`);
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Error adding to cart. Please try again.');
    }
  };

  // Buy now function
  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      navigate('/checkout');
    } catch (error) {
      console.error('Error with buy now:', error);
    }
  };

  // No wishlist functionality needed

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Handle zoom toggle
  const toggleZoom = () => {
    setShowZoom(!showZoom);
  };
  
  // Handle EMI selection
  const handleEmiSelect = (index) => {
    setSelectedEmi(index);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex bg-gray-50 p-2 rounded-lg shadow-sm mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
          <li className="inline-flex items-center">
            <a href="/" className="flex items-center text-gray-700 hover:text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <a href="/solar-module" className="text-gray-700 hover:text-green-600 ml-1 md:ml-2">Solar Panel</a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-500 ml-1 md:ml-2">{productData.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* Product Images */}
        <div className="lg:w-2/5 mb-6 lg:mb-0">
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
            <div className="flex flex-row gap-3">
              {/* Thumbnail Images - Vertical Layout */}
              <div className="flex flex-col gap-2 w-1/5">
                {productData.images.slice(0, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className={`h-14 overflow-hidden bg-gray-100 flex items-center justify-center p-1 rounded cursor-pointer border ${activeImage === index ? 'border-green-500' : 'border-gray-200 hover:border-green-300'}`}
                    onClick={() => handleImageChange(index)}
                  >
                    <img 
                      src={fixImageUrl(image)} 
                      alt={`${productData.name} - view ${index + 1}`} 
                      className="object-contain h-full w-full"
                    />
                  </div>
                ))}
              </div>
              
              {/* Main Image with Enhanced Zoom */}
              <div 
                ref={zoomRef}
                className="h-80 w-4/5 overflow-hidden bg-white flex items-center justify-center p-2 rounded relative"
                onMouseMove={(e) => {
                  const container = e.currentTarget;
                  const { left, top, width, height } = container.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  container.querySelector('img').style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.8)';
                  setShowZoom(true);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                  setShowZoom(false);
                }}
              >
                <img 
                  src={fixImageUrl(productData.images[activeImage])} 
                  alt={productData.name} 
                  className="object-contain h-full w-full transition-transform duration-300"
                />
              </div>
            </div>
          </div>
          
          {/* Share Button */}
          <div className="flex justify-between mt-3">
            <button className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
              <FaShareAlt className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{productData.name}</h1>
            
            {/* SKU and Rating */}
            <div className="flex flex-wrap items-center justify-between mb-3">
              <p className="text-sm text-gray-500">SKU: <span className="font-medium">{productData.sku}</span></p>
              <div className="flex items-center">
                {renderStars(productData.rating)}
                <a href="#reviews" className="ml-1 text-sm text-blue-600 hover:underline">
                  ({productData.reviewCount} reviews)
                </a>
              </div>
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">₹{productData.price.toLocaleString()}</span>
                {productData.originalPrice && (
                  <span className="text-base text-gray-500 line-through ml-2">₹{productData.originalPrice.toLocaleString()}</span>
                )}
                {productData.discount && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                    Save ₹{productData.discount.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-600">Inclusive of all taxes</p>
              </div>
            </div>
            
            {/* Offers & EMI */}
            <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Offers & EMI</h3>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {productData.emiOptions && productData.emiOptions.length > 0 ? (
                  productData.emiOptions.map((emi, index) => (
                    <div 
                      key={index}
                      onClick={() => handleEmiSelect(index)}
                      className={`cursor-pointer border ${selectedEmi === index ? 'border-green-500 bg-green-50' : 'border-gray-200'} rounded p-2 text-center hover:border-green-300 transition-colors`}
                    >
                      <p className="text-xs font-medium text-gray-800">{emi.months}m</p>
                      <p className="text-xs text-gray-600">₹{emi.amount}/mo</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-6 text-sm text-gray-500">No EMI options available</div>
                )}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <FaInfoCircle className="w-3 h-3 mr-1" />
                No Cost EMI available on select cards
              </div>
            </div>
            
            {/* Stock Status */}
            <div className="mb-4 flex items-center">
              {productData.inStock ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <svg className="-ml-0.5 mr-1 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <svg className="-ml-0.5 mr-1 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Out of Stock
                </span>
              )}
              <span className="ml-2 text-xs text-gray-600">Free delivery</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs text-gray-600">Usually ships in 1-2 business days</span>
            </div>
            
            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded-l focus:outline-none"
                >
                  −
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly
                  className="w-12 text-center py-1 border-t border-b border-gray-300 bg-white text-sm"
                />
                <button 
                  onClick={incrementQuantity}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded-r focus:outline-none"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center text-sm"
                onClick={handleAddToCart}
                disabled={product?.isOutOfStock}
              >
                <FaShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product?.isOutOfStock}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <FaBolt className="w-4 h-4 mr-2" />
                Buy Now
              </button>
            </div>
            
            {/* Secure Transaction */}
            <div className="flex items-center justify-center mb-4 text-xs text-gray-600 bg-gray-50 py-2 rounded">
              <FaUserShield className="w-3 h-3 mr-1 text-green-600" />
              100% Secure transaction
            </div>
            
            {/* Services */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center p-2 bg-white rounded border border-gray-200">
                <FaShippingFast className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-xs text-center text-gray-700">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border border-gray-200">
                <FaRegCreditCard className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-xs text-center text-gray-700">Pay on Delivery</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border border-gray-200">
                <FaShieldAlt className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-xs text-center text-gray-700">Warranty</span>
              </div>
            </div>
            
            {/* Seller Info */}
            <div className="mb-4 border border-gray-200 rounded p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FaStore className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium">Sold by <a href="#" className="text-blue-600 hover:underline">Cosmic Solar</a></span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Top Seller</span>
              </div>
            </div>
            
            {/* Delivery */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium">Delivery to</span>
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Enter pincode" 
                  className="w-full border border-gray-300 rounded-l py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-3 rounded-r border border-l-0 border-gray-300 text-sm">
                  Check
                </button>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Product Details</h3>
              <ul className="grid grid-cols-1 gap-2">
                <li className="flex items-start text-xs">
                  <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Price:</strong> ₹{productData.price}</span>
                </li>
                <li className="flex items-start text-xs">
                  <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Stock:</strong> {productData.stock} units available</span>
                </li>
                {productData.categoryId && (
                  <li className="flex items-start text-xs">
                    <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Category:</strong> {productData.categoryId.name}</span>
                  </li>
                )}
                <li className="flex items-start text-xs">
                  <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Stock Status:</strong> {productData.isOutOfStock ? 'Out of Stock' : 'In Stock'}</span>
                </li>
                <li className="flex items-start text-xs">
                  <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Product ID:</strong> {productData._id}</span>
                </li>
                <li className="flex items-start text-xs">
                  <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Added On:</strong> {new Date(productData.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="flex items-start text-xs">
                  <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Last Updated:</strong> {new Date(productData.updatedAt).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
            
            {/* Features - Only show if available */}
            {productData.features && productData.features.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Key Features</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {productData.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-xs">
                      <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Features */}
      <div className="mt-6">
        <h2 className="text-base font-medium text-gray-900 mb-3">Product Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <FaSun className="w-5 h-5 text-yellow-500" />, title: "High Efficiency", description: "Maximum power conversion" },
            { icon: <FaShieldAlt className="w-5 h-5 text-blue-500" />, title: "Durable & Reliable", description: "Built to last for years" },
            { icon: <FaBolt className="w-5 h-5 text-orange-500" />, title: "Easy Installation", description: "Simple plug-and-play setup" },
            { icon: <FaLeaf className="w-5 h-5 text-green-500" />, title: "Eco-Friendly", description: "Clean renewable energy" }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 flex flex-col items-center text-center">
              <div className="bg-gray-50 rounded-full p-2 mb-2">
                {feature.icon}
              </div>
              <h3 className="font-medium text-gray-900 mb-1 text-sm">{feature.title}</h3>
              <p className="text-gray-600 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Product Applications */}
      {productData.applications && productData.applications.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">Product Applications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {productData.applications.map((app, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="h-24 overflow-hidden">
                  <img 
                    src={app.image} 
                    alt={app.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <h3 className="font-medium text-gray-900 text-xs">{app.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Description and Tabs */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              <button 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'description' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'specifications' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({productData.reviewCount})
              </button>
              <button 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'faq' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('faq')}
              >
                FAQ
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'description' && (
              <div>
                <p className="text-sm text-gray-700 mb-4">{productData.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-800">Key Features</h3>
                    <ul className="space-y-2">
                      {productData.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-xs">
                          <FaCheck className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-800">What's in the Box</h3>
                    <ul className="space-y-2">
                       {productData.boxContents && productData.boxContents.length > 0 ? (
                         productData.boxContents.map((item, index) => (
                           <li key={index} className="flex items-start text-xs">
                             <FaBox className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                             <span className="text-gray-700">{item}</span>
                           </li>
                         ))
                       ) : (
                         <li className="flex items-start text-xs">
                           <FaBox className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                           <span className="text-gray-700">Product package contents information not available</span>
                         </li>
                       )}
                      </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <div className="overflow-hidden bg-white rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {productData.specifications && productData.specifications.length > 0 ? (
                        productData.specifications.map((spec, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900 w-1/3">
                              {spec.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                              {spec.value}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-4 py-2 text-xs text-gray-500 text-center">
                            No specifications available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-3 md:mb-0">
                      <h3 className="text-lg font-bold text-gray-900">{productData.rating.toFixed(1)}</h3>
                      <div className="flex items-center mt-1">
                        {renderStars(productData.rating)}
                        <span className="ml-2 text-xs text-gray-600">Based on {productData.reviewCount} reviews</span>
                      </div>
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors duration-200 flex items-center justify-center">
                      <FaStar className="w-3 h-3 mr-1" />
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Rating Breakdown</h4>
                    <div className="space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        // Calculate percentage safely
                        const percentage = productData.ratingBreakdown && productData.reviewCount > 0 
                          ? Math.round(((productData.ratingBreakdown[star] || 0) / productData.reviewCount) * 100)
                          : 0;
                        
                        return (
                          <div key={star} className="flex items-center">
                            <div className="w-12 text-xs text-gray-600">{star} stars</div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mx-2">
                              <div 
                                className="bg-yellow-400 h-1.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-xs text-gray-600 text-right">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {productData.reviews.slice(0, 2).map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2 text-xs">
                            {review.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{review.author}</h4>
                            <div className="flex items-center mt-0.5">
                              {renderStars(review.rating)}
                              <span className="ml-1 text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded text-xs">
                          Verified
                        </div>
                      </div>
                      <h5 className="font-medium text-gray-900 mt-2 text-sm">{review.title}</h5>
                      <p className="text-gray-700 mt-1 text-xs">{review.content}</p>
                      <div className="mt-2 flex items-center">
                        <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                          <FaThumbsUp className="w-3 h-3 mr-1" />
                          Helpful ({review.helpfulCount})
                        </button>
                        <button className="flex items-center text-xs text-gray-500 hover:text-gray-700 ml-3">
                          <FaFlag className="w-3 h-3 mr-1" />
                          Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'faq' && (
              <div className="space-y-3">
                {productData.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded overflow-hidden">
                    <button 
                      className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-900 font-medium bg-white hover:bg-gray-50 focus:outline-none text-sm"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transform ${openFaqs.includes(index) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaqs.includes(index) && (
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 text-xs">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Offers & EMIs */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Offers & EMIs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-medium text-green-800 mb-2 flex items-center">
              <FaRegCreditCard className="w-4 h-4 mr-2" />
              Credit Card EMIs on 17+ Banks
            </h3>
            <p className="text-sm text-gray-700">No cost EMI available on credit cards from major banks</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white text-xs font-medium rounded border border-gray-200">HDFC</span>
              <span className="px-2 py-1 bg-white text-xs font-medium rounded border border-gray-200">ICICI</span>
              <span className="px-2 py-1 bg-white text-xs font-medium rounded border border-gray-200">SBI</span>
              <span className="px-2 py-1 bg-white text-xs font-medium rounded border border-gray-200">Axis</span>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Debit Card & Cardless EMI options
            </h3>
            <p className="text-sm text-gray-700">Flexible payment options available for your convenience</p>
            <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
              View all EMI options
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Additional Offers */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Additional Offers</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <span className="font-medium">5% Instant Discount</span>
                <p className="text-sm text-gray-600">on HDFC Bank Credit Cards</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <span className="font-medium">Free Installation</span>
                <p className="text-sm text-gray-600">on orders above ₹5000</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Customer Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-white p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center" id="reviews">
            <FaStar className="w-5 h-5 mr-2 text-yellow-500" />
            Customer Reviews
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">{productData.rating}.0</div>
                <div className="flex justify-center my-3">
                  {renderStars(productData.rating)}
                </div>
                <p className="text-sm text-gray-600 mb-4">{productData.reviewCount} verified ratings</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-sm">
                  <FaPencilAlt className="w-4 h-4 mr-2" />
                  Write a Review
                </button>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium mr-3">R</div>
                      <div>
                        <span className="font-medium text-gray-900">Rahul S.</span>
                        <p className="text-xs text-gray-500">Verified Purchase</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        {renderStars(5)}
                      </div>
                      <p className="text-xs text-gray-500 text-right">2 months ago</p>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Excellent for DIY projects!</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Great product! The solar panel works perfectly for my small DIY project. Excellent build quality and good power output. I'm very satisfied with the purchase and would recommend it to others.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-3">A</div>
                      <div>
                        <span className="font-medium text-gray-900">Anita K.</span>
                        <p className="text-xs text-gray-500">Verified Purchase</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        {renderStars(5)}
                      </div>
                      <p className="text-xs text-gray-500 text-right">1 month ago</p>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Perfect for educational purposes</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">I bought this for my students to learn about solar energy and it's been a great teaching tool. The quality is excellent and it demonstrates solar principles perfectly.</p>
                </div>
              </div>
              
              <button className="mt-5 w-full border border-gray-300 bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-sm">
                Load More Reviews
                <FaChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center">
            <FaBoxOpen className="w-5 h-5 mr-2 text-blue-500" />
            Related Products
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Related Product Card 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="relative">
                <img src={power1} alt="Related Product" className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">New</div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">100W Solar Panel Kit</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-1">
                    {renderStars(4)}
                  </div>
                  <span className="text-xs text-gray-500">(42)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹4,999</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹5,999</span>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200">
                    <FaShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Related Product Card 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="relative">
                <img src={power2} alt="Related Product" className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Sale</div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">Solar Charge Controller 30A</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-1">
                    {renderStars(5)}
                  </div>
                  <span className="text-xs text-gray-500">(78)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹2,499</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹3,299</span>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200">
                    <FaShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Related Product Card 3 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="relative">
                <img src={power3} alt="Related Product" className="w-full h-48 object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">1000W Power Inverter</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-1">
                    {renderStars(4)}
                  </div>
                  <span className="text-xs text-gray-500">(36)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹8,999</span>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200">
                    <FaShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Related Product Card 4 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="relative">
                <img src={power4} alt="Related Product" className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Popular</div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">Battery Bank 12V 100Ah</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-1">
                    {renderStars(5)}
                  </div>
                  <span className="text-xs text-gray-500">(124)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹12,999</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹14,999</span>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200">
                    <FaShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center">
              View All Related Products
              <FaArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;