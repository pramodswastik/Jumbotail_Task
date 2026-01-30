/**
 * Demo/Test file for Phase 2
 * Tests the Product model and ProductStore functionality
 * Run with: node demos/Phase2Demo.js
 */

const Product = require('../models/Product');
const productStore = require('../models/ProductStore');
const { 
  stringSimilarity, 
  extractKeywords, 
  extractPriceFromQuery,
  detectQueryIntent,
  calculateRelevanceScore 
} = require('../utils/searchUtils');

console.log('\n=== Phase 2: Data Models & In-Memory Storage Demo ===\n');

// Demo 1: Create and store products
console.log('1️⃣  Creating sample products...');
const product1 = new Product({
  title: 'iPhone 16 Pro',
  description: 'Latest iPhone with A18 Pro chip and advanced cameras',
  price: 99999,
  mrp: 109999,
  rating: 4.8,
  stock: 50,
  brand: 'Apple',
  category: 'Mobile Phones',
  salesCount: 1200,
  returnRate: 1.5
});

const product2 = new Product({
  title: 'Samsung Galaxy S24',
  description: 'Premium Android phone with Galaxy AI features',
  price: 79999,
  mrp: 89999,
  rating: 4.6,
  stock: 100,
  brand: 'Samsung',
  category: 'Mobile Phones',
  salesCount: 2300,
  returnRate: 2.0
});

const id1 = productStore.addProduct(product1);
const id2 = productStore.addProduct(product2);

console.log(`✅ Product 1 added with ID: ${id1}`);
console.log(`✅ Product 2 added with ID: ${id2}\n`);

// Demo 2: Retrieve products
console.log('2️⃣  Retrieving products by ID...');
const retrieved = productStore.getProductById(id1);
console.log(`Found: ${retrieved.title} - ₹${retrieved.price}\n`);

// Demo 3: Update metadata
console.log('3️⃣  Updating product metadata...');
productStore.updateProductMetadata(id1, {
  ram: '8GB',
  storage: '256GB',
  color: 'Space Black'
});
const updated = productStore.getProductById(id1);
console.log(`Updated metadata:`, updated.metadata, '\n');

// Demo 4: Search capabilities
console.log('4️⃣  Testing search capabilities...');
const titleResults = productStore.searchByTitle('iPhone');
console.log(`Found ${titleResults.length} products matching "iPhone"\n`);

// Demo 5: Filters
console.log('5️⃣  Testing filters...');
const inStock = productStore.getInStockProducts();
console.log(`${inStock.length} products in stock\n`);

const highRated = productStore.filterByRating(4.5);
console.log(`${highRated.length} products with rating >= 4.5\n`);

// Demo 6: Utility functions
console.log('6️⃣  Testing utility functions...');

// String similarity
const similarity = stringSimilarity('iPhone', 'ifone');
console.log(`Similarity between "iPhone" and "ifone": ${(similarity * 100).toFixed(1)}%`);

// Extract keywords
const keywords = extractKeywords('sasta wala iPhone 16 pro');
console.log(`Keywords from "sasta wala iPhone 16 pro": ${keywords.join(', ')}`);

// Price extraction
const priceRange = extractPriceFromQuery('iPhone under 50k rupees');
console.log(`Price range from "iPhone under 50k rupees": ₹${priceRange.min} - ₹${priceRange.max}`);

// Query intent
const intent = detectQueryIntent('latest iPhone with great quality');
console.log(`Intent detected: "${intent}"\n`);

// Demo 7: Relevance scoring
console.log('7️⃣  Testing relevance scoring...');
const query = 'cheap iPhone';
const relevance1 = calculateRelevanceScore(product1, query);
const relevance2 = calculateRelevanceScore(product2, query);
console.log(`Relevance of "${product1.title}" to "${query}": ${relevance1.toFixed(1)}`);
console.log(`Relevance of "${product2.title}" to "${query}": ${relevance2.toFixed(1)}\n`);

// Demo 8: Product calculations
console.log('8️⃣  Testing product calculations...');
console.log(`iPhone 16 Pro discount: ${product1.getDiscountPercentage()}%`);
console.log(`iPhone 16 Pro customer satisfaction: ${product1.getCustomerSatisfactionScore().toFixed(1)}/100`);
console.log(`iPhone 16 Pro popularity score: ${product1.getPopularityScore().toFixed(1)}\n`);

// Demo 9: Store statistics
console.log('9️⃣  Store statistics...');
const stats = productStore.getStatistics();
console.log('Store Statistics:');
console.log(`  Total Products: ${stats.totalProducts}`);
console.log(`  Categories: ${stats.totalCategories}`);
console.log(`  Brands: ${stats.totalBrands}`);
console.log(`  Average Rating: ${stats.avgRating}/5`);
console.log(`  In Stock: ${stats.inStockProducts}`);
console.log(`  Total Inventory Value: ₹${stats.totalValue.toLocaleString('en-IN')}\n`);

// Demo 10: Product JSON output
console.log('🔟 Product JSON output format:');
console.log(JSON.stringify(product1.toJSON(), null, 2));

console.log('\n✅ Phase 2 Demo Complete!\n');
