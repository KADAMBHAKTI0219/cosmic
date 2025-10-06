import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { categoryManagementApi } from '../../services/adminApi';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    description: '', 
    image: null,
    status: 'Active' 
  });
  const [editCategory, setEditCategory] = useState({
    _id: null,
    name: '', 
    description: '', 
    image: null,
    status: '' 
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // API से कैटेगरीज़ लोड करना
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryManagementApi.getAllCategories();
        const categoryData = response.data.data || response.data;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setError(null);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditCategory({ ...editCategory, image: file });
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      // Create form data for file upload
      const formData = new FormData();
      
      // Always append name with proper trimming
      formData.append('name', newCategory.name.trim());
      
      // Add description if available
      if (newCategory.description) {
        formData.append('description', newCategory.description.trim());
      }
      
      // Add status
      formData.append('status', newCategory.status || 'Active');
      
      // Handle image if available
      if (newCategory.image) {
        // Check if image is a File object or string
        if (newCategory.image instanceof File) {
          formData.append('image', newCategory.image);
        } else {
          formData.append('image', newCategory.image);
        }
      }

      console.log('Sending category data:', {
        name: newCategory.name.trim(),
        description: newCategory.description ? newCategory.description.trim() : '',
        status: newCategory.status || 'Active',
        image: newCategory.image ? 'Image present' : 'No image'
      });

      const response = await categoryManagementApi.createCategory(formData);
      console.log('Category added response:', response);
      
      // API से कैटेगरीज़ को फिर से लोड करना
      const categoriesResponse = await categoryManagementApi.getAllCategories();
      const categoryData = categoriesResponse.data.data || categoriesResponse.data;
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      
      toast.success('Category added successfully');
      setNewCategory({ name: '', description: '', image: null, status: 'Active' });
      setImagePreview(null);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding category:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add category';
      toast.error(errorMessage);
    }
  };

  const handleEditClick = async (categoryId) => {
    try {
      const response = await categoryManagementApi.getCategoryById(categoryId);
      const category = response.data.data || response.data;
      
      setEditCategory({ 
        _id: category._id,
        name: category.name, 
        description: category.description || '',
        image: null,
        status: category.status || 'Active'
      });
      
      if (category.imageUrl) {
        setEditImagePreview(category.imageUrl);
      }
      
      setShowEditModal(true);
    } catch (err) {
      toast.error('Failed to load category details');
      console.error('Error loading category details:', err);
    }
  };

  const handleEditCategory = async () => {
    try {
      if (!editCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const formData = new FormData();
      formData.append('name', editCategory.name);
      if (editCategory.description) {
        formData.append('description', editCategory.description);
      }
      if (editCategory.status) {
        formData.append('status', editCategory.status);
      }
      if (editCategory.image) {
        formData.append('image', editCategory.image);
      }

      const response = await categoryManagementApi.updateCategory(editCategory._id, formData);
      console.log('Category updated response:', response);
      
      // API से कैटेगरीज़ को फिर से लोड करना
      const categoriesResponse = await categoryManagementApi.getAllCategories();
      const categoryData = categoriesResponse.data.data || categoriesResponse.data;
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      
      toast.success('Category updated successfully');
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update category';
      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryManagementApi.deleteCategory(id);
        
        // API से कैटेगरीज़ को फिर से लोड करना
        const response = await categoryManagementApi.getAllCategories();
        const categoryData = response.data.data || response.data;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        
        toast.success('Category deleted successfully');
      } catch (err) {
        toast.error('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#92c51b]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{category.name.charAt(0)}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.description ? (
                    category.description.length > 50 
                      ? `${category.description.substring(0, 50)}...` 
                      : category.description
                  ) : 'No description'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {category.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEditClick(category._id)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Category</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newCategory.status}
                onChange={(e) => setNewCategory({...newCategory, status: e.target.value})}
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
                onClick={handleAddCategory}
              >
                <FaSave className="mr-2" /> Add Category
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Category</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editCategory.name}
                onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editCategory.description}
                onChange={(e) => setEditCategory({...editCategory, description: e.target.value})}
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                onChange={handleEditImageChange}
              />
              {editImagePreview && (
                <div className="mt-2">
                  <img 
                    src={editImagePreview} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editCategory.status}
                onChange={(e) => setEditCategory({...editCategory, status: e.target.value})}
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
                onClick={handleEditCategory}
              >
                <FaSave className="mr-2" /> Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;