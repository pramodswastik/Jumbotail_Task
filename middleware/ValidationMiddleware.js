/**
 * Input Validation Middleware
 * Validates all incoming requests
 */

const validateProductInput = (req, res, next) => {
  try {
    if (req.method === 'POST' && req.path === '/') {
      const { title, description, price, mrp, rating, stock } = req.body;

      const errors = [];

      // Title validation
      if (!title || typeof title !== 'string') {
        errors.push('Title is required and must be a string');
      } else if (title.trim().length < 3) {
        errors.push('Title must be at least 3 characters long');
      } else if (title.length > 200) {
        errors.push('Title cannot exceed 200 characters');
      }

      // Description validation
      if (!description || typeof description !== 'string') {
        errors.push('Description is required and must be a string');
      } else if (description.trim().length < 10) {
        errors.push('Description must be at least 10 characters long');
      } else if (description.length > 2000) {
        errors.push('Description cannot exceed 2000 characters');
      }

      // Price validation
      if (price === undefined || price === null) {
        errors.push('Price is required');
      } else if (isNaN(price) || price < 0) {
        errors.push('Price must be a positive number');
      } else if (price > 99999999) {
        errors.push('Price cannot exceed ₹9,99,99,999');
      }

      // MRP validation
      if (mrp === undefined || mrp === null) {
        errors.push('MRP is required');
      } else if (isNaN(mrp) || mrp < 0) {
        errors.push('MRP must be a positive number');
      } else if (mrp > 99999999) {
        errors.push('MRP cannot exceed ₹9,99,99,999');
      } else if (price > mrp) {
        errors.push('Selling price cannot be greater than MRP');
      }

      // Rating validation
      if (rating === undefined || rating === null) {
        errors.push('Rating is required');
      } else if (isNaN(rating) || rating < 0 || rating > 5) {
        errors.push('Rating must be a number between 0 and 5');
      }

      // Stock validation
      if (stock === undefined || stock === null) {
        errors.push('Stock is required');
      } else if (isNaN(stock) || stock < 0) {
        errors.push('Stock must be a non-negative number');
      } else if (!Number.isInteger(Number(stock))) {
        errors.push('Stock must be an integer');
      }

      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Validation Failed',
          message: 'Invalid product data',
          details: errors,
          timestamp: new Date().toISOString()
        });
      }
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid request format',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Search Query Validation Middleware
 */
const validateSearchInput = (req, res, next) => {
  try {
    const { query, limit, offset, sortBy, order } = req.query;

    const errors = [];

    // Query validation
    if (!query || typeof query !== 'string') {
      errors.push('Search query is required');
    } else if (query.trim().length === 0) {
      errors.push('Search query cannot be empty');
    } else if (query.length > 500) {
      errors.push('Search query cannot exceed 500 characters');
    }

    // Limit validation
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      errors.push('Limit must be a number between 1 and 100');
    }

    // Offset validation
    if (offset && (isNaN(offset) || offset < 0)) {
      errors.push('Offset must be a non-negative number');
    }

    // Sort validation
    const validSortFields = ['relevance', 'price', 'rating', 'sales'];
    if (sortBy && !validSortFields.includes(sortBy)) {
      errors.push(`sortBy must be one of: ${validSortFields.join(', ')}`);
    }

    // Order validation
    const validOrders = ['asc', 'desc'];
    if (order && !validOrders.includes(order)) {
      errors.push('order must be either "asc" or "desc"');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Failed',
        message: 'Invalid search parameters',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid request format',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP
 */
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!this.requests.has(ip)) {
        this.requests.set(ip, []);
      }

      const ipRequests = this.requests.get(ip);

      // Remove old requests outside the window
      const recentRequests = ipRequests.filter(time => now - time < this.windowMs);
      this.requests.set(ip, recentRequests);

      if (recentRequests.length >= this.maxRequests) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Max ${this.maxRequests} requests per minute`,
          retryAfter: Math.ceil(this.windowMs / 1000),
          timestamp: new Date().toISOString()
        });
      }

      recentRequests.push(now);
      res.set('X-RateLimit-Limit', this.maxRequests);
      res.set('X-RateLimit-Remaining', this.maxRequests - recentRequests.length);

      next();
    };
  }
}

/**
 * Error Handler Middleware
 * Catches and formats all errors
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.status || 500;
  let errorMessage = err.message || 'Internal Server Error';
  let errorType = err.name || 'Error';

  // Handle specific error types
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorMessage = 'Invalid JSON in request body';
    errorType = 'JSON Parse Error';
  }

  if (err instanceof TypeError) {
    statusCode = 400;
    errorType = 'Type Error';
  }

  if (err instanceof RangeError) {
    statusCode = 400;
    errorType = 'Range Error';
  }

  // Check for validation errors
  if (err.validation) {
    statusCode = 400;
    errorType = 'Validation Error';
  }

  res.status(statusCode).json({
    error: errorType,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

/**
 * Not Found Handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: [
      'GET /health',
      'POST /api/v1/product',
      'GET /api/v1/product',
      'GET /api/v1/product/:id',
      'PUT /api/v1/product/meta-data',
      'GET /api/v1/search/product',
      'GET /api/v1/search/stats'
    ],
    timestamp: new Date().toISOString()
  });
};

/**
 * Request Logging Middleware
 * Logs all requests with details
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(`[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`      Query: ${JSON.stringify(req.query)}`);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(`      Body: ${JSON.stringify(req.body).substring(0, 100)}...`);
      }
    }
  });

  next();
};

/**
 * Security Headers Middleware
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
};

module.exports = {
  validateProductInput,
  validateSearchInput,
  RateLimiter,
  errorHandler,
  notFoundHandler,
  requestLogger,
  securityHeaders
};
