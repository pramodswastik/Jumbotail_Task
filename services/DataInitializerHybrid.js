/**
 * Hybrid Data Initializer
 * Can initialize products from both web scraping and local data generation
 */

const Product = require('../models/Product');
const productStore = require('../models/ProductStore');
const { generateCompleteCatalog } = require('./ProductDataGenerator');
const WebScraper = require('./WebScraper');

/**
 * Initialize product store with hybrid approach
 * Tries to scrape real data from web, falls back to generated data
 */
async function initializeProductStoreHybrid() {
  console.log('🔄 Initializing product store with hybrid approach...');
  
  try {
    // Try to scrape popular electronics products
    const searchQueries = ['laptop', 'phone', 'tablet', 'headphones', 'charger', 'camera', 'smartwatch'];
    let scrapedProducts = [];

    for (const query of searchQueries) {
      console.log(`  📡 Scraping for "${query}"...`);
      try {
        const products = await WebScraper.scrapeProducts(query);
        scrapedProducts = scrapedProducts.concat(products);
        console.log(`    ✅ Found ${products.length} products`);
      } catch (error) {
        console.warn(`    ⚠️ Failed to scrape "${query}":`, error.message);
      }
    }

    // Add scraped products to store
    if (scrapedProducts.length > 0) {
      console.log(`\n📦 Adding ${scrapedProducts.length} scraped products to store...`);
      scrapedProducts.forEach(productData => {
        try {
          const product = new Product(productData);
          productStore.addProduct(product);
        } catch (error) {
          console.warn('Error adding product:', error.message);
        }
      });
    }

    // Supplement with some generated data for diversity
    console.log('\n📝 Adding supplementary generated products...');
    const generatedProducts = generateCompleteCatalog().slice(0, Math.max(0, 50 - scrapedProducts.length));
    
    generatedProducts.forEach(productData => {
      const product = new Product(productData);
      productStore.addProduct(product);
    });

    // Display statistics
    const stats = productStore.getStatistics();
    console.log('\n✅ Product store initialized successfully!');
    console.log(`📊 Loaded ${stats.totalProducts} products across ${stats.totalCategories} categories`);
    console.log(`🏢 Brands: ${stats.totalBrands}`);
    console.log(`💰 Total inventory value: ₹${stats.totalValue.toLocaleString('en-IN')}`);
    console.log(`⭐ Average rating: ${stats.avgRating}/5`);
    console.log(`📦 In stock items: ${stats.inStockProducts}`);
    
    return stats;

  } catch (error) {
    console.error('❌ Hybrid initialization failed:', error.message);
    console.log('🔄 Falling back to generated data only...');
    
    // Fallback to generated data only
    const sampleProducts = generateCompleteCatalog();
    sampleProducts.forEach(productData => {
      const product = new Product(productData);
      productStore.addProduct(product);
    });

    const stats = productStore.getStatistics();
    console.log('✅ Product store initialized with generated data');
    console.log(`📊 Loaded ${stats.totalProducts} products`);
    
    return stats;
  }
}

/**
 * Initialize product store with local generated data only
 */
function initializeProductStore() {
  console.log('Initializing product store with generated catalog...');
  
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
  initializeProductStoreHybrid,
  resetProductStore,
  generateCompleteCatalog
};
