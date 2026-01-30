/**
 * Search Routes
 * Handles product search and advanced ranking with web scraping
 */

const express = require('express');
const router = express.Router();
const productStore = require('../models/ProductStore');
const { RankingService } = require('../services/RankingService');
const WebScraper = require('../services/WebScraper');
const Product = require('../models/Product');
const {
  extractKeywords,
  extractPriceFromQuery,
  detectQueryIntent,
  textMatches
} = require('../utils/searchUtils');

/**
 * GET /api/v1/search/product
 * Search products with web scraping and advanced ranking algorithms
 * 
 * Query params:
 * - query: Search query (required)
 * - limit: Number of results to return (default: 20)
 * - offset: Pagination offset (default: 0)
 * - sortBy: Sort field (relevance, price, rating, sales) (default: relevance)
 * - order: Sort order (asc, desc) (default: desc)
 * - algorithm: Ranking algorithm (comprehensive, bm25) (default: comprehensive)
 * - diversify: Get diversified results (true/false) (default: false)
 * - useWeb: Use web scraping for real data (true/false) (default: true)
 * - minScore: Minimum ranking score threshold (default: 0)
 */
router.get('/product', async (req, res) => {
  try {
    const { 
      query, 
      limit = 20, 
      offset = 0, 
      sortBy = 'relevance', 
      order = 'desc',
      algorithm = 'comprehensive',
      diversify = false,
      useWeb = true,
      minScore = 0
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
    const useWebScraping = useWeb === 'true' || useWeb === true;
    const minScoreNum = Math.max(Number(minScore) || 0, 0);

    let results = [];
    let isWebScrapedData = false;

    // Use web scraping if requested - scrapes fresh data for each search
    if (useWebScraping) {
      console.log(`🌐 Live scraping web for: "${searchQuery}"...`);
      const scrapedProducts = await WebScraper.scrapeProducts(searchQuery);
      
      if (scrapedProducts && scrapedProducts.length > 0) {
        // Convert scraped data to Product objects
        results = scrapedProducts.map(productData => new Product(productData));
        isWebScrapedData = true;
        console.log(`✅ Found ${results.length} products from live web scraping`);
      } else {
        console.log('⚠️ Web scraping returned no results, falling back to local store');
        // Fallback to local store if scraping fails
        results = productStore.getAllProducts();
        
        // Filter local store results by search query
        results = results.filter(product => {
          const titleMatch = textMatches(product.title, searchQuery);
          const descriptionMatch = textMatches(product.description, searchQuery);
          const keywordMatch = extractKeywords(searchQuery).some(keyword =>
            textMatches(product.title + ' ' + product.description, keyword)
          );
          
          return titleMatch || descriptionMatch || keywordMatch;
        });
      }
    } else {
      // Get from local store
      results = productStore.getAllProducts();
      
      // Filter local store results by search query
      results = results.filter(product => {
        const titleMatch = textMatches(product.title, searchQuery);
        const descriptionMatch = textMatches(product.description, searchQuery);
        const keywordMatch = extractKeywords(searchQuery).some(keyword =>
          textMatches(product.title + ' ' + product.description, keyword)
        );
        
        return titleMatch || descriptionMatch || keywordMatch;
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        query: searchQuery,
        detectedIntent: detectQueryIntent(searchQuery),
        totalResults: 0,
        returnedResults: 0,
        data: [],
        message: 'No products found matching your search',
        dataSource: useWebScraping ? 'Web Scraping' : 'Local Store',
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

    // Apply minimum score threshold
    const filteredResults = rankedResults.filter(item => item.score >= minScoreNum);

    // Apply diversification if requested
    let finalResults = diversify === 'true' 
      ? RankingService.getDiversifiedResults(filteredResults, limitNum)
      : filteredResults;

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
      minScore: minScoreNum,
      dataSource: isWebScrapedData ? 'Live Web Scraping' : (useWebScraping ? 'Local Store (Fallback)' : 'Local Store'),
      scrapedFresh: isWebScrapedData,
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
 * GET /api/v1/search/suggestions
 * Get product suggestions based on partial query from web sources
 */
router.get('/suggestions', async (req, res) => {
  try {
    const { query = '' } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Query must be at least 2 characters',
        timestamp: new Date().toISOString()
      });
    }

    const suggestions = await WebScraper.getProductSuggestions(query.trim());

    res.status(200).json({
      success: true,
      query: query.trim(),
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to get suggestions',
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
