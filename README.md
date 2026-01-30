# E-Commerce Search Engine Microservice

A high-performance search and ranking engine for electronics e-commerce platform targeting Tier-2 and Tier-3 cities in India.

## 🎯 Project Overview

This microservice handles product cataloging, metadata management, and intelligent search ranking for a vast catalog of electronic products including:

- Mobile phones
- Laptops
- Headphones
- Phone accessories
- Other electronic gadgets

## 🏗️ Architecture

```
├── server.js                 # Main Express server
├── routes/                   # API route handlers
│   ├── productRoutes.js     # Product CRUD endpoints
│   └── searchRoutes.js      # Search and ranking endpoints
├── models/                   # Data models
├── services/                 # Business logic
├── middleware/               # Custom middleware
├── utils/                    # Utility functions
├── data/                     # Generated/scraped product data
└── package.json             # Dependencies
```

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React (Phase 9)
- **Data Processing**: Cheerio, Natural Language Processing
- **Storage**: In-memory (Phase 2), MongoDB (Good-to-have)

## 📋 Development Phases

1. **Phase 1**: Project setup and Express server ✅
2. **Phase 2**: Data models and in-memory storage
3. **Phase 3**: Scrape/generate product data
4. **Phase 4**: POST /api/v1/product API
5. **Phase 5**: PUT /api/v1/product/meta-data API
6. **Phase 6**: Basic search API implementation
7. **Phase 7**: Advanced ranking algorithms
8. **Phase 8**: Error handling and validation
9. **Phase 9**: React frontend for testing
10. **Phase 10**: Final polish and documentation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pramodswastik/ecommerce-search-engine.git
cd ecommerce-search-engine

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start      # Production mode
npm run dev    # Development mode with nodemon
```

### API Endpoints (To be implemented)

#### 1. Store Product

```
POST /api/v1/product
```

#### 2. Update Product Metadata

```
PUT /api/v1/product/meta-data
```

#### 3. Search Products

```
GET /api/v1/search/product?query=iPhone
```

#### 4. Health Check

```
GET /health
```

## 📊 Ranking Factors

The search engine will consider:

- **Relevance**: Keyword matching and NLP-based semantic similarity
- **Ratings**: Product reviews and ratings (out of 5)
- **Sales**: Number of units sold (popularity)
- **Stock**: Availability status
- **Price**: Discount percentage and value for money
- **Customer Satisfaction**: Return rate and complaints
- **Query Intent**: Whether it's a "budget" search or "premium" search

## 🔍 Supported Query Types

- Exact matches: "iPhone 16"
- Spelling mistakes: "Ifone 16"
- Hinglish: "Sasta wala iPhone" (Budget iPhone)
- Attribute-based: "iPhone red color"
- Price-based: "iPhone 50k rupees"
- Latest products: "Latest iPhone"

## ⚡ Performance Goals

- API latency: < 1000ms
- Support for 1000+ products
- Concurrent search handling

## 📝 Contributing

Commits follow the pattern: `[Phase X] - Description`

## 📄 License

MIT

---

**Status**: Phase 1 ✅ - Project initialization complete
