import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaSpinner, FaEye } from 'react-icons/fa';
import { productManagementApi, categoryManagementApi } from '../../services/adminApi';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    category: 'Electronics', 
    description: '',
    price: '', 
    stock: '', 
    status: 'Active',
    images: []
  });
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: '', 
    category: '', 
    description: '',
    price: '', 
    stock: '', 
    status: '',
    images: []
  });
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const [categories, setCategories] = useState(['Electronics', 'Fashion', 'Footwear', 'Home Appliances', 'Books', 'Sports']);

  // Load products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          productManagementApi.getAllProducts(),
          categoryManagementApi.getAllCategories()
        ]);
        
        setProducts(productsResponse.data.data || productsResponse.data);
        
        // Handle category data properly
        const categoryData = categoriesResponse.data.data || categoriesResponse.data;
        if (Array.isArray(categoryData)) {
          // Store both category ID and name
          const formattedCategories = categoryData.map(cat => ({
            id: cat._id || cat.id,
            name: cat.name
          }));
          console.log('Formatted categories:', formattedCategories);
          setCategories(formattedCategories);
        } else {
          console.error('Unexpected category data format:', categoriesResponse.data);
          // Fallback categories
          setCategories([
            { id: 'electronics', name: 'Electronics' },
            { id: 'fashion', name: 'Fashion' },
            { id: 'footwear', name: 'Footwear' },
            { id: 'home-appliances', name: 'Home Appliances' },
            { id: 'books', name: 'Books' },
            { id: 'sports', name: 'Sports' }
          ]);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
        toast.error('Failed to load products');
        // Fallback categories
        setCategories([
          { id: 'electronics', name: 'Electronics' },
          { id: 'fashion', name: 'Fashion' },
          { id: 'footwear', name: 'Footwear' },
          { id: 'home-appliances', name: 'Home Appliances' },
          { id: 'books', name: 'Books' },
          { id: 'sports', name: 'Sports' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product.category && 
        ((typeof product.category === 'string' && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))));
    
    const matchesCategory = categoryFilter === 'All' || 
      (product.category && 
        ((typeof product.category === 'string' && product.category === categoryFilter) ||
        (product.category.name && product.category.name === categoryFilter)));
    
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    try {
      // Create FormData for API call
      const formData = new FormData();
      
      // Handle category ID correctly
      const productData = {...newProduct};
      
      // Find category ID
      const selectedCategory = categories.find(cat => cat.name === newProduct.category);
      if (!selectedCategory) {
        console.error('Category not found in categories list:', newProduct.category);
        toast.error('Selected category is invalid. Please select a valid category.');
        return; // Don't proceed if category not found
      }
      
      // Use category ID, not name
      // Make sure to send the correct category ID to the backend
      productData.category = selectedCategory.id; 
      console.log('Using category ID:', selectedCategory.id);
      
      // Append text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if exists
      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }
      
      console.log('Sending product data with category ID:', productData.category);
      await productManagementApi.createProduct(formData);
      
      // Reload products from API
      const response = await productManagementApi.getAllProducts();
      setProducts(response.data.data || response.data);
      
      toast.success('Product added successfully');
      setNewProduct({ 
        name: '', 
        category: categories[0]?.name || 'Electronics', 
        description: '',
        price: '', 
        stock: '', 
        status: 'Active',
        images: []
      });
      setShowAddModal(false);
    } catch (err) {
      toast.error('Failed to add product: ' + (err.response?.data?.message || err.message));
      console.error('Error adding product:', err);
    }
  };

  const handleViewClick = (product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const handleEditClick = (product) => {
    setEditProduct({ 
      ...product,
      category: product.category ? (product.category.name || product.category) : ''
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async () => {
    try {
      const formData = new FormData();
      const productData = {...editProduct};
      
      // Find category ID
      const selectedCategory = categories.find(cat => cat.name === editProduct.category);
      if (!selectedCategory) {
        console.error('Category not found in categories list for edit:', editProduct.category);
        toast.error('Selected category is invalid. Please select a valid category.');
        return; // Don't proceed if category not found
      }
      
      // Use category ID instead of name
      productData.category = selectedCategory.id;
      
      // Use category ID, not name
      productData.category = selectedCategory.id;
      console.log('Using category ID for edit:', selectedCategory.id);
      
      // Append text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && key !== '_id' && key !== 'id') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if exists
      if (editProduct.images && editProduct.images.length > 0) {
        for (let i = 0; i < editProduct.images.length; i++) {
          formData.append('images', editProduct.images[i]);
        }
      }
      
      console.log('Sending product data with category ID for edit:', productData.category);
      const productId = editProduct._id || editProduct.id;
      if (!productId) {
        toast.error('Product ID is missing');
        return;
      }
      
      await productManagementApi.updateProduct(productId, formData);
      
      // Reload products from API
      const response = await productManagementApi.getAllProducts();
      setProducts(response.data.data || response.data);
      
      toast.success('Product updated successfully');
      setShowEditModal(false);
    } catch (err) {
      toast.error('Failed to update product: ' + (err.response?.data?.message || err.message));
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productManagementApi.deleteProduct(id);
        
        // API से प्रोडक्ट्स को फिर से लोड करना
        const response = await productManagementApi.getAllProducts();
        setProducts(response.data.data || response.data);
        
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div>
          <select
          className="border rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
          ))}
        </select>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleViewClick(product)}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEditClick(product)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteProduct(product._id || product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹)</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
              <input
                type="number"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
              <input
                type="file"
                multiple
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                onChange={(e) => setNewProduct({...newProduct, images: e.target.files})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newProduct.status}
                onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleAddProduct}
              >
                <FaSave className="mr-2" /> Add Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editProduct.name}
                onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editProduct.category}
                onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editProduct.description}
                onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹)</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editProduct.price}
                onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
              <input
                type="number"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editProduct.stock}
                onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
              <input
                type="file"
                multiple
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                onChange={(e) => setEditProduct({...editProduct, images: e.target.files})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editProduct.status}
                onChange={(e) => setEditProduct({...editProduct, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleEditProduct}
              >
                <FaSave className="mr-2" /> Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            {viewProduct.images && viewProduct.images.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-700 text-sm font-bold mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Array.isArray(viewProduct.images) ? (
                    viewProduct.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                        alt={`Product ${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-bold mb-2">Product Name</h3>
              <p className="text-gray-600">{viewProduct.name}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-bold mb-2">Category</h3>
              <p className="text-gray-600">
                {viewProduct.category && typeof viewProduct.category === 'object' 
                  ? viewProduct.category.name 
                  : viewProduct.category}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-bold mb-2">Description</h3>
              <p className="text-gray-600">{viewProduct.description || 'No description available'}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-bold mb-2">Price</h3>
              <p className="text-gray-600">₹{viewProduct.price}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-bold mb-2">Stock</h3>
              <p className="text-gray-600">{viewProduct.stock}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-bold mb-2">Status</h3>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                viewProduct.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {viewProduct.status}
              </span>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;