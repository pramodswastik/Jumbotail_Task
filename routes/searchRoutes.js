/**
 * Search Routes
 * Handles product search and advanced ranking
 */

const express = require('express');
const router = express.Router();
const productStore = require('../models/ProductStore');
const { RankingService } = require('../services/RankingService');
const {
  extractKeywords,
  extractPriceFromQuery,
  detectQueryIntent,
  textMatches
} = require('../utils/searchUtils');

/**
 * GET /api/v1/search/product
 * Search products with advanced ranking algorithms
 * 
 * Query params:
 * - query: Search query (required)
 * - limit: Number of results to return (default: 20)
 * - offset: Pagination offset (default: 0)
 * - sortBy: Sort field (relevance, price, rating, sales) (default: relevance)
 * - order: Sort order (asc, desc) (default: desc)
 * - algorithm: Ranking algorithm (comprehensive, bm25) (default: comprehensive)
 * - diversify: Get diversified results (true/false) (default: false)
 */
router.get('/product', (req, res) => {
  try {
    const { 
      query, 
      limit = 20, 
      offset = 0, 
      sortBy = 'relevance', 
      order = 'desc',
      algorithm = 'comprehensive',
      diversify = false 
    } = req.query;

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

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        query: searchQuery,
        detectedIntent: detectQueryIntent(searchQuery),
        totalResults: 0,
        returnedResults: 0,
        data: [],
        message: 'No products found matching your search',
        timestamp: new Date().toISOString()
      });
    }

    // Detect query intent and extract price range
    const queryIntent = detectQueryIntent(searchQuery);
    const priceRange = extractPriceFromQuery(searchQuery);

    // Apply advanced ranking
    const rankedResults = RankingService.rankProducts(
      results,
      searchQuery,
      queryIntent,
      algorithm
    );

    // Apply diversification if requested
    let finalResults = diversify === 'true' 
      ? RankingService.getDiversifiedResults(rankedResults, limitNum)
      : rankedResults;

    // Apply sorting if not using relevance
    if (sortBy !== 'relevance') {
      const sortFunctions = {
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

      const sortFunc = sortFunctions[sortBy];
      if (sortFunc) {
        finalResults.sort(sortFunc);
      }
    }

    // Pagination
    const totalCount = finalResults.length;
    finalResults = finalResults.slice(offsetNum, offsetNum + limitNum);

    res.status(200).json({
      success: true,
      query: searchQuery,
      detectedIntent: queryIntent,
      priceRange,
      rankingAlgorithm: algorithm,
      diversified: diversify === 'true',
      totalResults: totalCount,
      returnedResults: finalResults.length,
      pagination: {
        limit: limitNum,
        offset: offsetNum
      },
      data: finalResults.map(r => ({
        ...r.product.toJSON(),
        score: parseFloat(r.score).toFixed(2),
        ranking: {
          relevance: parseFloat(r.ranking.relevance).toFixed(2),
          popularity: parseFloat(r.ranking.popularity).toFixed(2),
          quality: parseFloat(r.ranking.quality).toFixed(2),
          value: parseFloat(r.ranking.value).toFixed(2),
          recency: parseFloat(r.ranking.recency).toFixed(2)
        }
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
