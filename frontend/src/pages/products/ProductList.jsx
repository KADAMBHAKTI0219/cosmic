import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, cartApi } from '../../services/api';
import ProductGrid from '../products/ProductGrid';
import ProductSidebar from '../../components/products/productsidebar';

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

  const handleSidebarFilterChange = (filterData) => {
    const { type, value } = filterData;
    
    switch (type) {
      case 'search':
        setFilters(prev => ({ ...prev, search: value }));
        break;
      case 'category':
        setFilters(prev => ({ ...prev, category: value }));
        break;
      case 'price':
        setFilters(prev => ({ 
          ...prev, 
          minPrice: value.min !== '' ? value.min : undefined,
          maxPrice: value.max !== '' ? value.max : undefined
        }));
        break;
      case 'rating':
        setFilters(prev => ({ ...prev, rating: value }));
        break;
      case 'stock':
        setFilters(prev => ({ ...prev, inStock: value }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <ProductSidebar onFilterChange={handleSidebarFilterChange} />
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Sort Controls */}
          <div className="mb-6 flex justify-end">
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
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} loading={loading} />
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm p-8">
              <p className="text-gray-500 mb-4">No products found. Try adjusting your filters.</p>
              <button 
                onClick={() => {
                  setFilters({
                    category: '',
                    search: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  });
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;