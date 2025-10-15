/**
 * Utility functions to format product data from API responses
 */

/**
 * Formats product API response into a clean, usable structure
 * @param {Object} response - The raw API response object
 * @returns {Object} Clean product data structure
 */
export const formatProductResponse = (response) => {
  // Handle invalid responses
  if (!response || !response.data || !response.data.data) {
    return { products: [], pagination: {}, success: false };
  }

  const { data, pagination, success, count } = response.data;
  
  // Format each product
  const formattedProducts = Array.isArray(data) ? data.map(product => ({
    id: product._id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    mrp: product.mrp,
    stock: product.stock,
    isOutOfStock: product.isOutOfStock,
    category: product.categoryId?.name || 'Uncategorized',
    images: product.images || [],
    tags: product.tags || [],
    technical: product.technical || {},
    installation: product.installation || {},
    warrantyDetails: product.warrantyDetails || {},
  })) : [];

  return {
    products: formattedProducts,
    pagination,
    success: success || false,
    count: count || 0
  };
};

/**
 * Use this function to quickly log formatted product data to console
 * @param {Object} response - The raw API response
 */
export const logFormattedProducts = (response) => {
  const formatted = formatProductResponse(response);
  console.log('Products:', formatted.products);
  console.log('Count:', formatted.count);
  console.log('Success:', formatted.success);
};