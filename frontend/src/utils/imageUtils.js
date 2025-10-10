/**
 * Utility functions for handling image URLs
 */

// Get API base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Checks if a URL already contains a domain to prevent duplication
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL already has a domain
 */
const hasProtocol = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Extracts the path from a URL that might contain duplicate domains
 * @param {string} url - The URL to clean
 * @returns {string} - The cleaned URL path
 */
const cleanDuplicateDomains = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Check for duplicate domains like http://localhost:5000/http://localhost:5000/
  const duplicatePattern = /(https?:\/\/[^\/]+)\/(https?:\/\/[^\/]+)/;
  if (duplicatePattern.test(url)) {
    // Extract the path after the second domain
    const parts = url.split(duplicatePattern);
    if (parts.length >= 3) {
      // Use the first domain and the remaining path
      return parts[1] + parts.slice(2).join('');
    }
  }
  
  return url;
};

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
  
  // Clean any duplicate domains in the URL
  url = cleanDuplicateDomains(url);
  
  // If the image is already a full URL (starts with http or https) and not localhost, return it as is
  if (typeof url === 'string' && hasProtocol(url) && !url.includes('localhost')) {
    return url;
  }
  
  // Add timestamp for cache busting
  const timestamp = new Date().getTime();
  
  // Handle server uploads path - check if it contains 'uploads/products'
  if (typeof url === 'string' && url.includes('uploads/products')) {
    // Check if URL already contains the domain to prevent duplication
    if (hasProtocol(url)) {
      // URL already has domain, just add timestamp
      return `${url}?t=${timestamp}`;
    }
    
    // Make sure we have a clean path without duplicate slashes
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}?t=${timestamp}`;
  }
  
  // Handle paths that start with /uploads
  if (url.startsWith('/uploads')) {
    // Check if URL already contains the domain
    if (hasProtocol(url)) {
      return `${url}?t=${timestamp}`;
    }
    return `${API_BASE_URL}${url}?t=${timestamp}`;
  }
  
  // Handle paths that start with uploads (no leading slash)
  if (url.startsWith('uploads/')) {
    // Check if URL already contains the domain
    if (hasProtocol(url)) {
      return `${url}?t=${timestamp}`;
    }
    return `${API_BASE_URL}/${url}?t=${timestamp}`;
  }
  
  // If the image path is relative, prepend the API base URL from environment variables
  if (typeof url === 'string' && url.startsWith('/')) {
    // Check if URL already contains the domain
    if (hasProtocol(url)) {
      return url;
    }
    return `${API_BASE_URL}${url}`;
  }
  
  // Handle full URLs with localhost (replace with correct port)
  if (url.includes('localhost:')) {
    // Extract the path after the port
    const urlParts = url.split('/');
    const pathParts = urlParts.slice(3); // Remove protocol and domain parts
    return `${API_BASE_URL}/${pathParts.join('/')}?t=${timestamp}`;
  }
  
  // For any other string that doesn't match above conditions
  return url || 'https://via.placeholder.com/400x400?text=Image+Not+Available';
};