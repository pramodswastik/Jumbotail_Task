/**
 * Product Routes
 * Handles product CRUD operations
 */

const express = require('express');
const router = express.Router();
const ProductService = require('../services/ProductService');
const { validateProductData } = require('../utils/searchUtils');

/**
 * POST /api/v1/product
 * Create a new product
 * 
 * Body:
 * {
 *   "title": "iPhone 16 Pro",
 *   "description": "Latest iPhone with A18 Pro chip",
 *   "price": 99999,
 *   "mrp": 109999,
 *   "rating": 4.8,
 *   "stock": 50,
 *   "category": "Mobile Phones",
 *   "brand": "Apple",
 *   "metadata": { "ram": "8GB", "storage": "256GB" }
 * }
 */
router.post('/', (req, res) => {
  try {
    const { title, description, price, mrp, rating, stock, category, brand, metadata, currency } = req.body;

    // Validate required fields
    const validation = validateProductData({
      title,
      description,
      price,
      mrp,
      rating,
      stock
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation Failed',
        message: 'Invalid product data',
        details: validation.errors,
        timestamp: new Date().toISOString()
      });
    }

    // Additional validations
    if (price > mrp) {
      return res.status(400).json({
        error: 'Price Validation Failed',
        message: 'Selling price cannot be greater than MRP',
        timestamp: new Date().toISOString()
      });
    }

    // Create product
    const result = ProductService.createProduct({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      mrp: Number(mrp),
      rating: Number(rating),
      stock: Number(stock),
      category: category || 'Electronics',
      brand: brand || 'Unknown',
      currency: currency || 'INR',
      metadata: metadata || {},
      salesCount: 0,
      returnRate: 0,
      complaintCount: 0
    });

    res.status(201).json({
      success: true,
      productId: result.productId,
      message: result.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to create product',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/v1/product/:id
 * Retrieve a product by ID
 */
router.get('/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Product ID must be a valid number',
        timestamp: new Date().toISOString()
      });
    }

    const product = ProductService.getProduct(Number(productId));
    
    res.status(200).json({
      success: true,
      data: product,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/v1/product
 * Get all products with optional filtering
 * 
 * Query params:
 * - category: Filter by category
 * - brand: Filter by brand
 * - minPrice: Filter by minimum price
 * - maxPrice: Filter by maximum price
 * - minRating: Filter by minimum rating
 * - inStockOnly: Get only in-stock products (true/false)
 */
router.get('/', (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, minRating, inStockOnly } = req.query;

    const filters = {
      category: category || null,
      brand: brand || null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minRating: minRating ? Number(minRating) : null,
      inStockOnly: inStockOnly === 'true'
    };

    const products = ProductService.getAllProducts(filters);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products.map(p => p.toJSON()),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * PUT /api/v1/product/meta-data
 * Update product metadata
 * 
 * Body:
 * {
 *   "productId": 1,
 *   "metadata": {
 *     "ram": "8GB",
 *     "storage": "256GB",
 *     "color": "Space Black"
 *   }
 * }
 */
router.put('/meta-data', (req, res) => {
  try {
    const { productId, metadata } = req.body;

    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Product ID is required and must be a valid number',
        timestamp: new Date().toISOString()
      });
    }

    if (!metadata || typeof metadata !== 'object') {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Metadata is required and must be an object',
        timestamp: new Date().toISOString()
      });
    }

    const updated = ProductService.updateProductMetadata(Number(productId), metadata);

    res.status(200).json({
      success: true,
      productId: updated.productId,
      metadata: updated.metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
