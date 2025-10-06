import React, { useState, useEffect } from 'react';
import { productsApi, cartApi } from '../../services/api';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAllProducts(1, 10, filters);
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartApi.addToCart({ productId, quantity: 1 });
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add product to cart. Please try again.');
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            className="px-4 py-2 border rounded-md"
            value={filters.search}
            onChange={handleFilterChange}
          />
          
          <select
            name="category"
            className="px-4 py-2 border rounded-md"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <select
            name="sortBy"
            className="px-4 py-2 border rounded-md"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Date</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          
          <select
            name="sortOrder"
            className="px-4 py-2 border rounded-md"
            value={filters.sortOrder}
            onChange={handleFilterChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹{product.price}</span>
                  <div className="flex gap-2">
                    <Link 
                      to={`/products/${product._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No products found. Try changing your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;