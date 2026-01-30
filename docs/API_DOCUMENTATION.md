# API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Endpoints

### 1. Create Product

**POST** `/product`

Create a new product in the catalog.

**Request Body:**

```json
{
  "title": "iPhone 16 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 99999,
  "mrp": 109999,
  "rating": 4.8,
  "stock": 50,
  "category": "Mobile Phones",
  "brand": "Apple",
  "currency": "INR",
  "metadata": {
    "ram": "8GB",
    "storage": "256GB",
    "processor": "A18 Pro"
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "productId": 279,
  "message": "Product created successfully"
}
```

### 2. Get Product by ID

**GET** `/product/:productId`

Retrieve a specific product by ID.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "productId": 1,
    "title": "iPhone 16 Pro Max",
    "price": 119999,
    "mrp": 129999,
    "rating": 4.8,
    "stock": 45,
    "category": "Mobile Phones",
    "brand": "Apple"
  }
}
```

### 3. Get All Products

**GET** `/product?category=Mobile%20Phones&brand=Apple&minPrice=50000&maxPrice=150000`

Get all products with optional filters.

**Query Parameters:**

- `category` - Filter by category
- `brand` - Filter by brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minRating` - Minimum rating (0-5)
- `inStockOnly` - Get only in-stock products (true/false)

### 4. Update Product Metadata

**PUT** `/product/meta-data`

Update metadata for a product.

**Request Body:**

```json
{
  "productId": 1,
  "metadata": {
    "color": "Space Black",
    "warranty": "2 years"
  }
}
```

### 5. Search Products

**GET** `/search/product?query=iPhone&limit=10&offset=0&sortBy=relevance`

Search products with intelligent ranking.

**Query Parameters:**

- `query` _(required)_ - Search query
- `limit` - Results per page (default: 20, max: 100)
- `offset` - Pagination offset (default: 0)
- `sortBy` - Sort field: relevance, price, rating, sales (default: relevance)
- `order` - asc or desc (default: desc)

**Response:**

```json
{
  "success": true,
  "query": "iPhone",
  "detectedIntent": "general",
  "totalResults": 48,
  "returnedResults": 10,
  "data": [
    {
      "productId": 1,
      "title": "iPhone 16 Pro",
      "price": 99999,
      "relevanceScore": "85.50"
    }
  ]
}
```

### 6. Get Search Statistics

**GET** `/search/stats`

Get catalog and search statistics.

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalProducts": 279,
    "totalCategories": 6,
    "totalBrands": 20,
    "avgRating": "4.32",
    "inStockProducts": 210
  }
}
```

## Error Responses

**400 Bad Request:**

```json
{
  "error": "Validation Failed",
  "message": "Invalid product data",
  "details": ["Price must be greater than 0"]
}
```

**404 Not Found:**

```json
{
  "error": "Not Found",
  "message": "Product with ID 999 not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal Server Error",
  "message": "Failed to process request"
}
```

## Sample Queries

### Budget iPhone

```
GET /search/product?query=sasta%20wala%20iPhone&sortBy=price&order=asc
```

### Latest iPhone

```
GET /search/product?query=latest%20iPhone&sortBy=sales&order=desc
```

### iPhone with spelling correction

```
GET /search/product?query=ifone%2016
```

### iPhone under 50k

```
GET /search/product?query=iPhone%2050k%20rupees&sortBy=price&order=asc
```

### Red color iPhone

```
GET /search/product?query=iPhone%20red%20color
```

## Performance Notes

- Response times: < 500ms for most queries
- Search results limited to 100 max per request
- In-memory storage for sub-second access
- Indexed by category and brand for fast filtering
