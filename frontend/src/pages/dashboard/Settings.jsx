import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaLock, FaBell, FaSave, FaShieldAlt } from 'react-icons/fa';
import { authApi } from '../../services/api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: false
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      await authApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      toast.success('Password changed successfully');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Problem changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Call API to update notification settings
      await authApi.updateNotificationSettings(notificationSettings);
      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Problem updating notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>
      
      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <FaShieldAlt className="mr-2 text-main" /> Change Password
          </h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main transition-all duration-200"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main transition-all duration-200"
                required
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-main text-white px-6 py-2 rounded-lg hover:bg-main-dark transition-colors duration-300 flex items-center shadow-sm hover:shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <FaBell className="mr-2 text-main" /> Notification Settings
          </h2>
        </div>
        
        <form onSubmit={handleNotificationSubmit}>
          <div className="space-y-4">
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-5 w-5 text-main focus:ring-main border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-3 block text-sm text-gray-700 font-medium">
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <input
                type="checkbox"
                id="orderUpdates"
                name="orderUpdates"
                checked={notificationSettings.orderUpdates}
                onChange={handleNotificationChange}
                className="h-5 w-5 text-main focus:ring-main border-gray-300 rounded"
              />
              <label htmlFor="orderUpdates" className="ml-3 block text-sm text-gray-700 font-medium">
                Order Updates
              </label>
            </div>
            
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <input
                type="checkbox"
                id="promotionalEmails"
                name="promotionalEmails"
                checked={notificationSettings.promotionalEmails}
                onChange={handleNotificationChange}
                className="h-5 w-5 text-main focus:ring-main border-gray-300 rounded"
              />
              <label htmlFor="promotionalEmails" className="ml-3 block text-sm text-gray-700 font-medium">
                Promotional Emails
              </label>
            </div>
            
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationChange}
                className="h-5 w-5 text-main focus:ring-main border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-3 block text-sm text-gray-700 font-medium">
                SMS Notifications
              </label>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-main text-white px-6 py-2 rounded-lg hover:bg-main-dark transition-colors duration-300 flex items-center shadow-sm hover:shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;