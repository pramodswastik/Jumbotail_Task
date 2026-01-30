/**
 * Product Catalog Statistics
 * Generated product data information
 */

const CATALOG_STATS = {
  totalProducts: null, // Will be populated at runtime
  categories: {
    'Mobile Phones': {
      brands: ['Apple', 'Samsung', 'Xiaomi'],
      subCategories: {
        'Apple': ['iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 15', 'iPhone 15 Plus'],
        'Samsung': ['Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra', 'Galaxy A15', 'Galaxy A25', 'Galaxy A35'],
        'Xiaomi': ['Redmi 13', 'Redmi 13C', 'Redmi 12', 'Redmi Note 13']
      },
      estimatedCount: 120 // Approx count for calculation
    },
    'Laptops': {
      brands: ['Apple', 'Dell', 'Lenovo', 'HP', 'ASUS'],
      estimatedCount: 33
    },
    'Headphones': {
      brands: ['Sony', 'Apple', 'JBL', 'Bose', 'Sennheiser', 'Boat'],
      estimatedCount: 27
    },
    'Phone Accessories': {
      brands: ['Apple', 'Spigen', 'OtterBox', 'ANKER', 'Belkin', 'IQ Shield', 'MI'],
      estimatedCount: 60
    },
    'Tablets': {
      brands: ['Apple', 'Samsung', 'Lenovo'],
      estimatedCount: 18
    },
    'Smart Watches': {
      brands: ['Apple', 'Samsung', 'Garmin', 'Fitbit'],
      estimatedCount: 20
    }
  },

  /**
   * Get total estimated products
   */
  getTotalEstimatedProducts() {
    return Object.values(this.categories).reduce((sum, cat) => sum + cat.estimatedCount, 0);
  },

  /**
   * Get category distribution
   */
  getCategoryDistribution() {
    const total = this.getTotalEstimatedProducts();
    const distribution = {};
    
    for (const [category, data] of Object.entries(this.categories)) {
      distribution[category] = {
        count: data.estimatedCount,
        percentage: ((data.estimatedCount / total) * 100).toFixed(1) + '%'
      };
    }
    
    return distribution;
  },

  /**
   * Get all brands
   */
  getAllBrands() {
    const brands = new Set();
    for (const cat of Object.values(this.categories)) {
      if (cat.brands) {
        cat.brands.forEach(b => brands.add(b));
      }
    }
    return Array.from(brands).sort();
  },

  /**
   * Print catalog info
   */
  printCatalogInfo() {
    console.log('\n=== E-COMMERCE PRODUCT CATALOG INFORMATION ===\n');
    console.log(`Total Estimated Products: ${this.getTotalEstimatedProducts()}`);
    console.log(`Total Categories: ${Object.keys(this.categories).length}`);
    console.log(`Total Brands: ${this.getAllBrands().length}`);
    console.log(`\nBrands: ${this.getAllBrands().join(', ')}`);
    console.log('\n--- Category Distribution ---');
    const distribution = this.getCategoryDistribution();
    for (const [cat, data] of Object.entries(distribution)) {
      console.log(`${cat}: ${data.count} products (${data.percentage})`);
    }
    console.log('\n');
  }
};

module.exports = CATALOG_STATS;
