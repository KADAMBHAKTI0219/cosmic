import React, { useState, useEffect } from 'react';
import { couponManagementApi } from '../../services/adminApi';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

const CouponsMangement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [currentCouponId, setCurrentCouponId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponManagementApi.getAllCoupons();
      setCoupons(response.data.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.code.trim()) {
      errors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      errors.code = 'Coupon code must be at least 3 characters';
    }
    
    if (!formData.discountValue) {
      errors.discountValue = 'Discount value is required';
    } else if (formData.discountType === 'percentage' && (formData.discountValue <= 0 || formData.discountValue > 100)) {
      errors.discountValue = 'Percentage discount must be between 1 and 100';
    } else if (formData.discountType === 'fixed' && formData.discountValue <= 0) {
      errors.discountValue = 'Fixed discount must be greater than 0';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Convert string values to numbers for numeric fields
    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
      discountValue: Number(formData.discountValue),
      minPurchase: formData.minPurchase ? Number(formData.minPurchase) : 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      value: Number(formData.discountValue) // Adding value field explicitly as required by backend
    };
    
    try {
      if (editMode) {
        await couponManagementApi.updateCoupon(currentCouponId, payload);
        toast.success('Coupon updated successfully');
      } else {
        await couponManagementApi.createCoupon(payload);
        toast.success('Coupon created successfully');
      }
      
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || '',
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      startDate: coupon.startDate?.split('T')[0] || '',
      endDate: coupon.endDate?.split('T')[0] || '',
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true
    });
    setFormErrors({});
    setEditMode(true);
    setCurrentCouponId(coupon._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponManagementApi.deleteCoupon(id);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('Failed to delete coupon');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      isActive: true
    });
    setFormErrors({});
    setEditMode(false);
    setCurrentCouponId(null);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && coupon.isActive) || 
      (filterStatus === 'inactive' && !coupon.isActive);
    
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Coupons Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Coupon' : 'Create New Coupon'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Coupon Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${formErrors.code ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter coupon code (e.g., SUMMER2023)"
              />
              {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
            </div>
            
            <div>
              <label className="block mb-2">Discount Type <span className="text-red-500">*</span></label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2">
                Discount Value <span className="text-red-500">*</span>
                {formData.discountType === 'percentage' && <span className="text-sm text-gray-500 ml-1">(1-100%)</span>}
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${formErrors.discountValue ? 'border-red-500' : 'border-gray-300'}`}
                min="1"
                max={formData.discountType === 'percentage' ? "100" : ""}
                placeholder={formData.discountType === 'percentage' ? "Enter percentage" : "Enter amount"}
              />
              {formErrors.discountValue && <p className="text-red-500 text-sm mt-1">{formErrors.discountValue}</p>}
            </div>
    
            
            <div>
              <label className="block mb-2">Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300"
                min="1"
                placeholder="Number of times coupon can be used"
              />
            </div>
            
            <div>
              <label className="block mb-2">Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.startDate && <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>}
            </div>
            
            <div>
              <label className="block mb-2">End Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.endDate && <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>}
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
              <p className="text-xs text-gray-500 ml-2">
                {formData.isActive ? 'Coupon is available for use' : 'Coupon is disabled'}
              </p>
            </div>
          </div>
          
          <div className="flex mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center justify-center px-4 py-2 rounded ${
                submitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white mr-2 min-w-[120px]`}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {editMode ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
                  {editMode ? 'Update Coupon' : 'Create Coupon'}
                </>
              )}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold">All Coupons</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded w-full md:w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button
              onClick={fetchCoupons}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            <span className="ml-2">Loading coupons...</span>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">No coupons found.</p>
            {searchTerm && <p className="text-sm text-gray-400 mt-1">Try changing your search criteria</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Code</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Discount</th>
                 
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Validity</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Usage</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map(coupon => (
                  <tr key={coupon._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{coupon.code}</td>
                    <td className="py-3 px-4">
                      {coupon.discountType === 'percentage' 
                        ? <span className="text-green-600 font-medium">{coupon.discountValue || 0}%</span> 
                        : <span className="text-green-600 font-medium">₹{coupon.discountValue || 0}</span>}
                      {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                        <span className="text-xs text-gray-500 block">Max: ₹{coupon.maxDiscount}</span>
                      )}
                    </td>
                   
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>From: {new Date(coupon.startDate).toLocaleDateString()}</div>
                        <div>To: {new Date(coupon.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {coupon.usageLimit ? (
                        <span>
                          {coupon.usedCount || 0}/{coupon.usageLimit} used
                        </span>
                      ) : (
                        <span>
                          {coupon.usedCount || 0} used (unlimited)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={async () => {
                          try {
                            await couponManagementApi.updateCoupon(coupon._id, {
                              ...coupon,
                              isActive: !coupon.isActive
                            });
                            toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'} successfully`);
                            fetchCoupons();
                          } catch (error) {
                            console.error('Error toggling coupon status:', error);
                            toast.error('Failed to update coupon status');
                          }
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          coupon.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {coupon.isActive ? (
                          <span className="flex items-center">
                            <FaCheck className="mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaTimes className="mr-1" />
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit coupon"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete coupon"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsMangement;