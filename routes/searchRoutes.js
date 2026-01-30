/**
 * Search Routes
 * Handles product search and ranking
 */

const express = require('express');
const router = express.Router();
const productStore = require('../models/ProductStore');
const {
  extractKeywords,
  extractPriceFromQuery,
  detectQueryIntent,
  calculateRelevanceScore,
  textMatches
} = require('../utils/searchUtils');

/**
 * GET /api/v1/search/product
 * Search products with intelligent ranking
 * 
 * Query params:
 * - query: Search query (required)
 * - limit: Number of results to return (default: 20)
 * - offset: Pagination offset (default: 0)
 * - sortBy: Sort field (relevance, price, rating, sales) (default: relevance)
 * - order: Sort order (asc, desc) (default: desc)
 */
router.get('/product', (req, res) => {
  try {
    const { query, limit = 20, offset = 0, sortBy = 'relevance', order = 'desc' } = req.query;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Search query is required',
        timestamp: new Date().toISOString()
      });
    }

    const searchQuery = query.trim();
    const limitNum = Math.min(Number(limit) || 20, 100); // Max 100 results
    const offsetNum = Math.max(Number(offset) || 0, 0);

    // Get all products
    let results = productStore.getAllProducts();

    // Filter by search query
    results = results.filter(product => {
      const titleMatch = textMatches(product.title, searchQuery);
      const descriptionMatch = textMatches(product.description, searchQuery);
      const keywordMatch = extractKeywords(searchQuery).some(keyword =>
        textMatches(product.title + ' ' + product.description, keyword)
      );
      
      return titleMatch || descriptionMatch || keywordMatch;
    });

    // Calculate relevance scores for each result
    results = results.map(product => ({
      product,
      relevanceScore: calculateRelevanceScore(product, searchQuery)
    }));

    // Filter out low relevance results (optional)
    results = results.filter(r => r.relevanceScore > 10);

    // Apply sorting
    const sortFunctions = {
      relevance: (a, b) => {
        return order === 'desc' 
          ? b.relevanceScore - a.relevanceScore 
          : a.relevanceScore - b.relevanceScore;
      },
      price: (a, b) => {
        return order === 'desc'
          ? b.product.price - a.product.price
          : a.product.price - b.product.price;
      },
      rating: (a, b) => {
        return order === 'desc'
          ? b.product.rating - a.product.rating
          : a.product.rating - b.product.rating;
      },
      sales: (a, b) => {
        return order === 'desc'
          ? b.product.salesCount - a.product.salesCount
          : a.product.salesCount - b.product.salesCount;
      }
    };

    const sortFunc = sortFunctions[sortBy] || sortFunctions.relevance;
    results.sort(sortFunc);

    // Pagination
    const totalCount = results.length;
    results = results.slice(offsetNum, offsetNum + limitNum);

    // Extract metadata
    const detectedIntent = detectQueryIntent(searchQuery);
    const priceRange = extractPriceFromQuery(searchQuery);

    res.status(200).json({
      success: true,
      query: searchQuery,
      detectedIntent,
      priceRange,
      totalResults: totalCount,
      returnedResults: results.length,
      pagination: {
        limit: limitNum,
        offset: offsetNum
      },
      data: results.map(r => ({
        ...r.product.toJSON(),
        relevanceScore: r.relevanceScore.toFixed(2)
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to search products',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/v1/search/stats
 * Get search statistics and catalog info
 */
router.get('/stats', (req, res) => {
  try {
    const stats = productStore.getStatistics();
    const categories = productStore.getAllCategories();
    const brands = productStore.getAllBrands();

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        categories,
        brands
      },
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

module.exports = router;
