/**
 * Data Initialization Service
 * Seeds the in-memory store with product data
 */

const Product = require('../models/Product');
const productStore = require('../models/ProductStore');
const { generateCompleteCatalog } = require('./ProductDataGenerator');

/**
 * Initialize the product store with generated data
 */
function initializeProductStore() {
  console.log('Initializing product store with generated catalog...');
  
  // Generate complete product catalog
  const sampleProducts = generateCompleteCatalog();
  
  sampleProducts.forEach(productData => {
    const product = new Product(productData);
    productStore.addProduct(product);
  });

  const stats = productStore.getStatistics();
  console.log('✅ Product store initialized');
  console.log(`📊 Loaded ${stats.totalProducts} products across ${stats.totalCategories} categories`);
  console.log(`🏢 Brands: ${stats.totalBrands}`);
  console.log(`💰 Total inventory value: ₹${stats.totalValue.toLocaleString('en-IN')}`);
  console.log(`⭐ Average rating: ${stats.avgRating}/5`);
  console.log(`📦 In stock items: ${stats.inStockProducts}`);
  
  return stats;
}

/**
 * Reset product store (for testing)
 */
function resetProductStore() {
  productStore.clear();
  console.log('Product store reset');
}

module.exports = {
  initializeProductStore,
  resetProductStore,
  generateCompleteCatalog
};
