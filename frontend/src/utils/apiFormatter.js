/**
 * Utility functions to format API responses
 */

/**
 * Formats an API response object into a more readable structure
 * @param {Object} response - The API response object
 * @returns {Object} Formatted response with data and metadata
 */
export const formatApiResponse = (response) => {
  // If response is not valid, return empty object
  if (!response || !response.data) {
    return { data: null, meta: { success: false } };
  }

  // Extract the main data
  const { data, success, count, pagination } = response.data;

  // Return formatted response
  return {
    data: data || [],
    meta: {
      success: success || false,
      count: count || 0,
      pagination: pagination || {},
    }
  };
};

/**
 * Formats product data for display
 * @param {Array} products - Array of product objects
 * @returns {Array} Formatted product objects
 */
export const formatProducts = (products) => {
  if (!Array.isArray(products)) return [];
  
  return products.map(product => ({
    id: product._id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price,
    oldPrice: product.oldPrice,
    mrp: product.mrp,
    stock: product.stock,
    isOutOfStock: product.isOutOfStock,
    category: product.categoryId?.name || 'Uncategorized',
    images: product.images || [],
    tags: product.tags || [],
    // Add more fields as needed
  }));
};

/**
 * Logs API response in a readable format
 * @param {Object} response - The API response object
 */
export const logFormattedResponse = (response) => {
  const formatted = formatApiResponse(response);
  console.log('API Response:', {
    success: formatted.meta.success,
    count: formatted.meta.count,
    data: formatted.data
  });
};