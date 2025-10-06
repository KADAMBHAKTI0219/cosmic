import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getAllCategories } from '../../services/api';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    category: 'Electronics', 
    price: '', 
    stock: '', 
    status: 'Active' 
  });
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: '', 
    category: '', 
    price: '', 
    stock: '', 
    status: '' 
  });

  const [categories, setCategories] = useState(['Electronics', 'Fashion', 'Footwear', 'Home Appliances', 'Books', 'Sports']);

  // API से प्रोडक्ट्स और कैटेगरीज़ लोड करना
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        
        setProducts(productsResponse.data.data || productsResponse.data);
        
        // कैटेगरी डेटा को सही तरीके से हैंडल करना
        const categoryData = categoriesResponse.data.data || categoriesResponse.data;
        if (Array.isArray(categoryData)) {
          setCategories(categoryData.map(cat => cat.name));
        } else {
          console.error('Unexpected category data format:', categoriesResponse.data);
          // फॉलबैक कैटेगरीज़
          setCategories(['Electronics', 'Fashion', 'Footwear', 'Home Appliances', 'Books', 'Sports']);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
        toast.error('Failed to load products');
        // फॉलबैक कैटेगरीज़
        setCategories(['Electronics', 'Fashion', 'Footwear', 'Home Appliances', 'Books', 'Sports']);
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
      (product.category && product.category.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' || 
      (product.category && product.category.name === categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    try {
      await createProduct(newProduct);
      
      // API से प्रोडक्ट्स को फिर से लोड करना
      const response = await getAllProducts();
      setProducts(response.data);
      
      toast.success('Product added successfully');
      setNewProduct({ name: '', category: 'Electronics', price: '', stock: '', status: 'Active' });
      setShowAddModal(false);
    } catch (err) {
      toast.error('Failed to add product');
      console.error('Error adding product:', err);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct({ 
      ...product,
      category: product.category ? product.category.name : ''
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async () => {
    try {
      await updateProduct(editProduct._id, editProduct);
      
      // API से प्रोडक्ट्स को फिर से लोड करना
      const response = await getAllProducts();
      setProducts(response.data);
      
      toast.success('Product updated successfully');
      setShowEditModal(false);
    } catch (err) {
      toast.error('Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        
        // API से प्रोडक्ट्स को फिर से लोड करना
        const response = await getAllProducts();
        setProducts(response.data);
        
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
            className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
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
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEditClick(product)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteProduct(product.id)}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
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
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
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
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
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
    </div>
  );
};

export default ProductManagement;