/**
 * API Testing Examples
 * Use these with tools like Postman, curl, or VS Code REST Client
 */

// ============================================
// 1. CREATE A NEW PRODUCT
// ============================================

// POST http://localhost:3000/api/v1/product
// Headers: Content-Type: application/json

{
  "title": "iPhone 17 Pro",
  "description": "Latest iPhone with breakthrough features and design",
  "price": 129999,
  "mrp": 139999,
  "rating": 4.9,
  "stock": 100,
  "category": "Mobile Phones",
  "brand": "Apple",
  "currency": "INR",
  "metadata": {
    "ram": "12GB",
    "storage": "256GB",
    "screensize": "6.3 inches",
    "processor": "A19",
    "color": "Black",
    "battery": "3500 mAh"
  }
}

// Expected Response (201 Created):
{
  "success": true,
  "productId": 279,
  "message": "Product created successfully",
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// 2. GET A PRODUCT BY ID
// ============================================

// GET http://localhost:3000/api/v1/product/1

// Expected Response (200 OK):
{
  "success": true,
  "data": {
    "productId": 1,
    "title": "iPhone 16 Pro Max Black",
    "description": "Latest iPhone 16 Pro Max...",
    "rating": 4.8,
    "stock": 45,
    "price": 119999,
    "mrp": 129999,
    "discountPercentage": 8,
    "metadata": {...},
    "category": "Mobile Phones",
    "brand": "Apple",
    "salesCount": 2340,
    "returnRate": 2.1,
    "complaintCount": 5
  },
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// 3. GET ALL PRODUCTS
// ============================================

// GET http://localhost:3000/api/v1/product

// With filters:
// GET http://localhost:3000/api/v1/product?category=Mobile%20Phones&brand=Apple&minPrice=50000&maxPrice=150000&minRating=4.5&inStockOnly=true

// Expected Response (200 OK):
{
  "success": true,
  "count": 25,
  "data": [
    {...product1...},
    {...product2...}
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// 4. UPDATE PRODUCT METADATA
// ============================================

// PUT http://localhost:3000/api/v1/product/meta-data
// Headers: Content-Type: application/json

{
  "productId": 279,
  "metadata": {
    "ram": "12GB",
    "storage": "512GB",
    "color": "Gold",
    "warranty": "2 years"
  }
}

// Expected Response (200 OK):
{
  "success": true,
  "productId": 279,
  "metadata": {
    "ram": "12GB",
    "storage": "512GB",
    "screensize": "6.3 inches",
    "processor": "A19",
    "color": "Gold",
    "battery": "3500 mAh",
    "warranty": "2 years"
  },
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// 5. SEARCH PRODUCTS
// ============================================

// GET http://localhost:3000/api/v1/search/product?query=iPhone&limit=10&offset=0&sortBy=relevance&order=desc

// Query Examples:
// - http://localhost:3000/api/v1/search/product?query=iPhone%2016
// - http://localhost:3000/api/v1/search/product?query=sasta%20wala%20iPhone
// - http://localhost:3000/api/v1/search/product?query=ifone%2016
// - http://localhost:3000/api/v1/search/product?query=iPhone%20red%20color
// - http://localhost:3000/api/v1/search/product?query=iPhone%2050k%20rupees
// - http://localhost:3000/api/v1/search/product?query=latest%20iPhone

// Expected Response (200 OK):
{
  "success": true,
  "query": "iPhone",
  "detectedIntent": "general",
  "priceRange": null,
  "totalResults": 48,
  "returnedResults": 10,
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "data": [
    {
      "productId": 1,
      "title": "iPhone 16 Pro Max Black",
      "description": "Latest iPhone...",
      "price": 119999,
      "mrp": 129999,
      "rating": 4.8,
      "stock": 45,
      "relevanceScore": "87.50"
    },
    {...more results...}
  ],
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// 6. GET SEARCH STATISTICS
// ============================================

// GET http://localhost:3000/api/v1/search/stats

// Expected Response (200 OK):
{
  "success": true,
  "stats": {
    "totalProducts": 279,
    "totalCategories": 6,
    "totalBrands": 20,
    "avgRating": "4.32",
    "inStockProducts": 210,
    "totalValue": 125000000,
    "categories": ["Mobile Phones", "Laptops", "Headphones", ...],
    "brands": ["Apple", "Samsung", "Xiaomi", ...]
  },
  "timestamp": "2026-01-30T10:30:00.000Z"
}

// ============================================
// 7. HEALTH CHECK
// ============================================

// GET http://localhost:3000/health

// Expected Response (200 OK):
{
  "status": "OK",
  "timestamp": "2026-01-30T10:30:00.000Z"
}
