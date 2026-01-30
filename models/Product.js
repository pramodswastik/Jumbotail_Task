/**
 * Product Model
 * Defines the structure and validation for product entities
 */

class Product {
  /**
   * Create a new Product instance
   * @param {Object} data - Product data
   * @param {string} data.title - Product title/name
   * @param {string} data.description - Detailed product description
   * @param {number} data.rating - Product rating (0-5)
   * @param {number} data.stock - Available stock quantity
   * @param {number} data.price - Selling price
   * @param {number} data.mrp - Maximum retail price
   * @param {string} data.currency - Currency code (e.g., 'INR')
   * @param {string} data.productId - Optional product ID
   * @param {Object} data.metadata - Optional product metadata (specs, features, etc.)
   */
  constructor({
    title,
    description,
    rating = 0,
    stock = 0,
    price,
    mrp,
    currency = 'INR',
    productId = null,
    metadata = {},
    category = 'Electronics',
    brand = 'Unknown',
    salesCount = 0,
    returnRate = 0,
    complaintCount = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.productId = productId;
    this.title = title;
    this.description = description;
    this.rating = Math.min(Math.max(rating, 0), 5); // Ensure 0-5 range
    this.stock = stock;
    this.price = price;
    this.mrp = mrp;
    this.currency = currency;
    this.metadata = metadata;
    this.category = category;
    this.brand = brand;
    this.salesCount = salesCount;
    this.returnRate = returnRate; // Percentage (0-100)
    this.complaintCount = complaintCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Calculate discount percentage
   * @returns {number} Discount percentage
   */
  getDiscountPercentage() {
    if (this.mrp === 0) return 0;
    return Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }

  /**
   * Check if product is in stock
   * @returns {boolean}
   */
  isInStock() {
    return this.stock > 0;
  }

  /**
   * Get customer satisfaction score based on ratings and returns
   * @returns {number} Score between 0-100
   */
  getCustomerSatisfactionScore() {
    const ratingScore = (this.rating / 5) * 100;
    const returnPenalty = this.returnRate * 0.5; // Each 1% return = 0.5% penalty
    return Math.max(0, ratingScore - returnPenalty);
  }

  /**
   * Get popularity score based on sales
   * @returns {number} Popularity index
   */
  getPopularityScore() {
    // Log scale to normalize high sales counts
    return Math.log10(Math.max(this.salesCount, 1) + 1) * 10;
  }

  /**
   * Update product metadata
   * @param {Object} newMetadata - New metadata to merge
   */
  updateMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
    this.updatedAt = new Date();
  }

  /**
   * Convert to JSON response format
   * @returns {Object} Product data for API response
   */
  toJSON() {
    return {
      productId: this.productId,
      title: this.title,
      description: this.description,
      rating: this.rating,
      stock: this.stock,
      price: this.price,
      mrp: this.mrp,
      currency: this.currency,
      discountPercentage: this.getDiscountPercentage(),
      metadata: this.metadata,
      category: this.category,
      brand: this.brand,
      salesCount: this.salesCount,
      returnRate: this.returnRate,
      complaintCount: this.complaintCount
    };
  }
}

module.exports = Product;
