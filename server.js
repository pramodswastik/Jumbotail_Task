/**
 * Main Server File
 * Initializes Express server and sets up routing
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

// Import data initializer
const { initializeProductStore } = require('./services/DataInitializer');

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
app.listen(PORT, () => {
  console.log(`🚀 E-commerce Search Engine Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Initialize product store with sample data
  console.log('\n📦 Initializing product catalog...');
  initializeProductStore();
  console.log('\n✅ Server ready to handle requests!\n');
});

module.exports = app;
