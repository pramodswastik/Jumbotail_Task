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

// Import data initializer
const { initializeProductStore } = require('./services/DataInitializer');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/search', searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

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
