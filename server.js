/**
 * Main Server File
 * Initializes Express server and sets up routing
 * Supports both web-scraped data and generated data
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Import middleware
const {
  validateProductInput,
  validateSearchInput,
  RateLimiter,
  errorHandler,
  notFoundHandler,
  requestLogger,
  securityHeaders
} = require('./middleware/ValidationMiddleware');

// Import data initializers
const { initializeProductStore } = require('./services/DataInitializer');
const { initializeProductStoreHybrid } = require('./services/DataInitializerHybrid');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(securityHeaders);

// Request logging
app.use(requestLogger);

// Rate limiting
const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
app.use(rateLimiter.middleware());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/product', validateProductInput, productRoutes);
app.use('/api/v1/search', validateSearchInput, searchRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (MUST be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const USE_WEB_SCRAPING = process.env.USE_WEB_SCRAPING !== 'false';

app.listen(PORT, async () => {
  console.log(`🚀 E-commerce Search Engine Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Initialize product store
  console.log('\n📦 Initializing product catalog...');
  
  try {
    if (USE_WEB_SCRAPING) {
      console.log('🌐 Using hybrid mode (Web Scraping + Generated Data)\n');
      await initializeProductStoreHybrid();
    } else {
      console.log('📝 Using generated data only\n');
      initializeProductStore();
    }
  } catch (error) {
    console.error('⚠️ Initialization error:', error.message);
    console.log('📝 Falling back to generated data...\n');
    initializeProductStore();
  }
  
  console.log('\n✅ Server ready to handle requests!');
  console.log(`📌 Web Scraping Mode: ${USE_WEB_SCRAPING ? 'ENABLED' : 'DISABLED'}`);
  console.log(`💡 Tip: Use ?useWeb=false parameter to use local data only\n`);
});

module.exports = app;
