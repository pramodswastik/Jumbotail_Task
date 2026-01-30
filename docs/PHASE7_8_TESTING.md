/**
 * Advanced Ranking and Error Handling Test Examples
 * Phase 7-8 Testing Guide
 */

// ============================================
// PHASE 7: ADVANCED RANKING EXAMPLES
// ============================================

/**
 * Example 1: Budget iPhone Search
 * The system detects "sasta" (cheap) intent and adjusts weights
 * Value score (30%) > Relevance (30%) vs normal (35%)
 */
GET /api/v1/search/product?query=sasta%20wala%20iPhone&limit=10&algorithm=comprehensive
// Response shows products ranked by value (discount %) primarily

/**
 * Example 2: Premium iPhone Search
 * Detects "premium" intent, quality score gets more weight
 * Quality (30%) > Relevance (30%) vs normal (20%)
 */
GET /api/v1/search/product?query=premium%20iPhone&limit=10&algorithm=comprehensive

/**
 * Example 3: Latest iPhone Search
 * Detects "latest" intent, recency score gets more weight
 * Recency (25%) > normal (5%)
 * Prioritizes newer models and fresh products
 */
GET /api/v1/search/product?query=latest%20iPhone&limit=10&algorithm=comprehensive

/**
 * Example 4: Quality-focused Search
 * Gets products with highest ratings and lowest complaint rates
 * Quality score emphasized
 */
GET /api/v1/search/product?query=iPhone%20quality&limit=10&algorithm=comprehensive

/**
 * Example 5: Diversified Results
 * Prevents monopoly by single brand
 * Shows max 3 products per brand, max 5 per category
 */
GET /api/v1/search/product?query=laptop&limit=20&diversify=true&algorithm=comprehensive

/**
 * Example 6: Price-sorted Results
 * Overrides algorithm sorting to sort by price
 */
GET /api/v1/search/product?query=headphones&sortBy=price&order=asc&limit=10

/**
 * Example 7: Rating-sorted Results
 * Overrides algorithm to sort by highest ratings
 */
GET /api/v1/search/product?query=phone%20charger&sortBy=rating&order=desc&limit=10

/**
 * Example 8: Popularity-sorted Results
 * Overrides algorithm to sort by sales count
 */
GET /api/v1/search/product?query=case&sortBy=sales&order=desc&limit=10

/**
 * RANKING SCORE BREAKDOWN (Response Data)
 * Each product includes:
 * {
 *   "score": "75.50",  // Final composite score (0-100)
 *   "ranking": {
 *     "relevance": "85.00",    // How well it matches the query
 *     "popularity": "70.00",   // Sales count + ratings + stock
 *     "quality": "80.00",      // Rating + return rate + complaints
 *     "value": "65.00",        // Discount % + price-to-rating ratio
 *     "recency": "60.00"       // Product age + trend
 *   }
 * }
 */

// ============================================
// PHASE 8: ERROR HANDLING EXAMPLES
// ============================================

/**
 * Test 1: Missing Required Field (Price)
 * Status: 400 Bad Request
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 16",
  "description": "Latest iPhone...",
  // Missing price field
  "mrp": 109999,
  "rating": 4.8,
  "stock": 50
}

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid product data",
  "details": [
    "Price is required",
    "Selling price cannot be greater than MRP"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 2: Invalid Price (greater than MRP)
 * Status: 400 Bad Request
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 16",
  "description": "Latest iPhone...",
  "price": 150000,  // Greater than MRP
  "mrp": 109999,
  "rating": 4.8,
  "stock": 50
}

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid product data",
  "details": [
    "Selling price cannot be greater than MRP"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 3: Invalid Rating (out of range)
 * Status: 400 Bad Request
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 16",
  "description": "Latest iPhone...",
  "price": 99999,
  "mrp": 109999,
  "rating": 5.5,  // Must be 0-5
  "stock": 50
}

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid product data",
  "details": [
    "Rating must be a number between 0 and 5"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 4: Invalid Search Query
 * Status: 400 Bad Request
 */
GET /api/v1/search/product?query=

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid search parameters",
  "details": [
    "Search query is required"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 5: Invalid Limit Parameter
 * Status: 400 Bad Request
 */
GET /api/v1/search/product?query=iPhone&limit=150

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid search parameters",
  "details": [
    "Limit must be a number between 1 and 100"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 6: Invalid Sort Field
 * Status: 400 Bad Request
 */
GET /api/v1/search/product?query=iPhone&sortBy=popularity

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid search parameters",
  "details": [
    "sortBy must be one of: relevance, price, rating, sales"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 7: Rate Limit Exceeded
 * Status: 429 Too Many Requests
 * After 100 requests in 60 seconds
 */
GET /api/v1/search/product?query=iPhone

// Response:
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Max 100 requests per minute",
  "retryAfter": 60,
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 8: Not Found Endpoint
 * Status: 404 Not Found
 */
GET /api/v1/invalid-endpoint

// Response:
{
  "error": "Not Found",
  "message": "The endpoint GET /api/v1/invalid-endpoint does not exist",
  "availableEndpoints": [
    "GET /health",
    "POST /api/v1/product",
    "GET /api/v1/product",
    "GET /api/v1/product/:id",
    "PUT /api/v1/product/meta-data",
    "GET /api/v1/search/product",
    "GET /api/v1/search/stats"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 9: Product Not Found
 * Status: 404 Not Found
 */
GET /api/v1/product/99999

// Response:
{
  "error": "Not Found",
  "message": "Product with ID 99999 not found",
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 10: Invalid JSON in Body
 * Status: 400 Bad Request
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 16"
  "description": "Missing comma"  // Syntax error
}

// Response:
{
  "error": "JSON Parse Error",
  "message": "Invalid JSON in request body",
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 11: Title Too Short
 * Status: 400 Bad Request
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "IP",  // Too short (min 3)
  "description": "Latest iPhone with amazing features",
  "price": 99999,
  "mrp": 109999,
  "rating": 4.8,
  "stock": 50
}

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid product data",
  "details": [
    "Title must be at least 3 characters long"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 12: Description Too Long
 * Status: 400 Bad Request
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 16",
  "description": "... (over 2000 characters)",
  "price": 99999,
  "mrp": 109999,
  "rating": 4.8,
  "stock": 50
}

// Response:
{
  "error": "Validation Failed",
  "message": "Invalid product data",
  "details": [
    "Description cannot exceed 2000 characters"
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 13: Metadata Update with Invalid Product ID
 * Status: 404 Not Found
 */
PUT /api/v1/product/meta-data
Content-Type: application/json

{
  "productId": 99999,
  "metadata": {
    "color": "Black"
  }
}

// Response:
{
  "error": "Not Found",
  "message": "Product with ID 99999 not found",
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Test 14: Missing Metadata in Update
 * Status: 400 Bad Request
 */
PUT /api/v1/product/meta-data
Content-Type: application/json

{
  "productId": 1
  // Missing metadata field
}

// Response:
{
  "error": "Validation Failed",
  "message": "Metadata is required and must be an object",
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// SUCCESS RESPONSES
// ============================================

/**
 * Success: Create Product
 * Status: 201 Created
 */
POST /api/v1/product
Content-Type: application/json

{
  "title": "iPhone 16 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 99999,
  "mrp": 109999,
  "rating": 4.8,
  "stock": 100,
  "category": "Mobile Phones",
  "brand": "Apple",
  "metadata": {
    "ram": "8GB",
    "storage": "256GB",
    "processor": "A18 Pro"
  }
}

// Response (201):
{
  "success": true,
  "productId": 279,
  "message": "Product created successfully",
  "timestamp": "2026-01-30T10:30:00.000Z"
}

/**
 * Success: Advanced Search with Ranking
 * Status: 200 OK
 */
GET /api/v1/search/product?query=budget%20iPhone&limit=5&algorithm=comprehensive

// Response (200):
{
  "success": true,
  "query": "budget iPhone",
  "detectedIntent": "budget",
  "rankingAlgorithm": "comprehensive",
  "totalResults": 28,
  "returnedResults": 5,
  "pagination": {
    "limit": 5,
    "offset": 0
  },
  "data": [
    {
      "productId": 15,
      "title": "iPhone 15",
      "price": 69999,
      "mrp": 79999,
      "rating": 4.6,
      "score": "78.45",
      "ranking": {
        "relevance": "82.50",
        "popularity": "75.00",
        "quality": "78.00",
        "value": "85.00",
        "recency": "60.00"
      }
    },
    // ... more products
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}
