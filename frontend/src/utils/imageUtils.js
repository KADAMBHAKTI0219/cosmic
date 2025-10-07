/**
 * Utility functions for handling image URLs
 */

// Get API base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fixes image URLs to use the correct base path
 * @param {string} url - The original image URL
 * @returns {string} - The corrected image URL
 */
export const fixImageUrl = (url) => {
  // If imageUrl is null or undefined, return fallback image
  if (!url) {
    return 'https://via.placeholder.com/400x400?text=Image+Not+Available';
  }
  
  // If it's an imported image (webpack module), return the object itself
  if (typeof url === 'object') {
    return url;
  }
  
  // If the image is already a full URL (starts with http or https), return it as is
  if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('localhost')) {
    return url;
  }
  
  // Handle server uploads path - check if it contains 'uploads/products'
  if (typeof url === 'string' && url.includes('uploads/products')) {
    // Make sure we have a clean path without duplicate slashes
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    
    // Use the backend server URL with the correct port (5000)
    // Add a timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    return `http://localhost:5000${cleanPath}?t=${timestamp}`;
  }
  
  // Handle paths that start with /uploads
  if (url.startsWith('/uploads')) {
    const timestamp = new Date().getTime();
    return `${API_BASE_URL}${url}?t=${timestamp}`;
  }
  
  // Handle paths that start with uploads (no leading slash)
  if (url.startsWith('uploads/')) {
    const timestamp = new Date().getTime();
    return `${API_BASE_URL}/${url}?t=${timestamp}`;
  }
  
  // If the image path is relative, prepend the API base URL from environment variables
  if (typeof url === 'string' && url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // Handle full URLs with localhost (replace with correct port)
  if (url.includes('localhost:')) {
    // Extract the path after the port
    const urlParts = url.split('/');
    const pathParts = urlParts.slice(3); // Remove protocol and domain parts
    const timestamp = new Date().getTime();
    return `${API_BASE_URL}/${pathParts.join('/')}?t=${timestamp}`;
  }
  
  // For any other string that doesn't match above conditions
  return url || 'https://via.placeholder.com/400x400?text=Image+Not+Available';
};