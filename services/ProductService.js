/**
 * Product Service
 * Business logic layer for product operations
 */

const Product = require('../models/Product');
const productStore = require('../models/ProductStore');

class ProductService {
  /**
   * Create and store a new product
   * @param {Object} productData - Product data from request
   * @returns {Object} Created product with ID
   */
  static createProduct(productData) {
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'mrp', 'rating', 'stock'];
    for (const field of requiredFields) {
      if (productData[field] === undefined || productData[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Create product instance
    const product = new Product({
      title: productData.title,
      description: productData.description,
      price: productData.price,
      mrp: productData.mrp,
      rating: productData.rating,
      stock: productData.stock,
      currency: productData.currency || 'INR',
      category: productData.category || 'Electronics',
      brand: productData.brand || 'Unknown',
      metadata: productData.metadata || {},
      salesCount: productData.salesCount || 0,
      returnRate: productData.returnRate || 0,
      complaintCount: productData.complaintCount || 0
    });

    // Add to store and get ID
    const productId = productStore.addProduct(product);
    product.productId = productId;

    return {
      productId,
      message: 'Product created successfully'
    };
  }

  /**
   * Get product by ID
   * @param {number} productId - Product ID
   * @returns {Object} Product data or null
   */
  static getProduct(productId) {
    const product = productStore.getProductById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return product.toJSON();
  }

  /**
   * Update product metadata
   * @param {number} productId - Product ID
   * @param {Object} metadata - Metadata to update
   * @returns {Object} Updated product
   */
  static updateProductMetadata(productId, metadata) {
    const product = productStore.updateProductMetadata(productId, metadata);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return product.toJSON();
  }

  /**
   * Get all products with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Product[]}
   */
  static getAllProducts(filters = {}) {
    let products = productStore.getAllProducts();

    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
      products = products.filter(p => p.brand === filters.brand);
    }
    if (filters.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minRating) {
      products = products.filter(p => p.rating >= filters.minRating);
    }
    if (filters.inStockOnly) {
      products = products.filter(p => p.isInStock());
    }

    return products;
  }

  /**
   * Get store statistics
   * @returns {Object} Statistics
   */
  static getStatistics() {
    return productStore.getStatistics();
  }

  /**
   * Delete all products (for testing/reset)
   */
  static clearAllProducts() {
    productStore.clear();
  }
}

module.exports = ProductService;
