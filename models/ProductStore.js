/**
 * In-Memory Product Store
 * Manages all products in memory with fast access and search capabilities
 */

const Product = require('../models/Product');

class ProductStore {
  constructor() {
    // Map for O(1) product lookup by ID
    this.products = new Map();
    
    // Index for category-based searches
    this.categoryIndex = new Map();
    
    // Index for brand-based searches
    this.brandIndex = new Map();
    
    // Counter for auto-incrementing product IDs
    this.idCounter = 0;
  }

  /**
   * Add a new product to the store
   * @param {Product} product - Product instance to add
   * @returns {number} Generated product ID
   */
  addProduct(product) {
    // Generate ID if not provided
    if (!product.productId) {
      this.idCounter++;
      product.productId = this.idCounter;
    } else if (product.productId > this.idCounter) {
      this.idCounter = product.productId;
    }

    // Store product
    this.products.set(product.productId, product);

    // Update category index
    if (!this.categoryIndex.has(product.category)) {
      this.categoryIndex.set(product.category, []);
    }
    this.categoryIndex.get(product.category).push(product.productId);

    // Update brand index
    if (!this.brandIndex.has(product.brand)) {
      this.brandIndex.set(product.brand, []);
    }
    this.brandIndex.get(product.brand).push(product.productId);

    return product.productId;
  }

  /**
   * Retrieve product by ID
   * @param {number} productId - Product ID
   * @returns {Product|null}
   */
  getProductById(productId) {
    return this.products.get(productId) || null;
  }

  /**
   * Update product metadata
   * @param {number} productId - Product ID
   * @param {Object} metadata - Metadata to update
   * @returns {Product|null}
   */
  updateProductMetadata(productId, metadata) {
    const product = this.products.get(productId);
    if (!product) return null;
    
    product.updateMetadata(metadata);
    return product;
  }

  /**
   * Get all products
   * @returns {Product[]}
   */
  getAllProducts() {
    return Array.from(this.products.values());
  }

  /**
   * Get products by category
   * @param {string} category - Category name
   * @returns {Product[]}
   */
  getProductsByCategory(category) {
    const ids = this.categoryIndex.get(category) || [];
    return ids.map(id => this.products.get(id)).filter(p => p !== null);
  }

  /**
   * Get products by brand
   * @param {string} brand - Brand name
   * @returns {Product[]}
   */
  getProductsByBrand(brand) {
    const ids = this.brandIndex.get(brand) || [];
    return ids.map(id => this.products.get(id)).filter(p => p !== null);
  }

  /**
   * Search products by title (partial match)
   * @param {string} query - Search query
   * @returns {Product[]}
   */
  searchByTitle(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllProducts().filter(product =>
      product.title.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search products by description
   * @param {string} query - Search query
   * @returns {Product[]}
   */
  searchByDescription(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllProducts().filter(product =>
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter products by price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Product[]}
   */
  filterByPriceRange(minPrice, maxPrice) {
    return this.getAllProducts().filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  /**
   * Filter products by minimum rating
   * @param {number} minRating - Minimum rating (0-5)
   * @returns {Product[]}
   */
  filterByRating(minRating) {
    return this.getAllProducts().filter(product =>
      product.rating >= minRating
    );
  }

  /**
   * Get only in-stock products
   * @returns {Product[]}
   */
  getInStockProducts() {
    return this.getAllProducts().filter(product => product.isInStock());
  }

  /**
   * Get total number of products
   * @returns {number}
   */
  getTotalProductCount() {
    return this.products.size;
  }

  /**
   * Get all categories
   * @returns {string[]}
   */
  getAllCategories() {
    return Array.from(this.categoryIndex.keys());
  }

  /**
   * Get all brands
   * @returns {string[]}
   */
  getAllBrands() {
    return Array.from(this.brandIndex.keys());
  }

  /**
   * Clear all products (useful for testing)
   */
  clear() {
    this.products.clear();
    this.categoryIndex.clear();
    this.brandIndex.clear();
    this.idCounter = 0;
  }

  /**
   * Get store statistics
   * @returns {Object} Store statistics
   */
  getStatistics() {
    const allProducts = this.getAllProducts();
    return {
      totalProducts: allProducts.length,
      totalCategories: this.categoryIndex.size,
      totalBrands: this.brandIndex.size,
      avgRating: allProducts.length > 0
        ? (allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(2)
        : 0,
      inStockProducts: this.getInStockProducts().length,
      totalValue: allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
    };
  }
}

// Create singleton instance for the application
const productStore = new ProductStore();

module.exports = productStore;
module.exports.ProductStore = ProductStore;
