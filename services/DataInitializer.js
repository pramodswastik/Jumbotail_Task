/**
 * Data Initialization Service
 * Seeds the in-memory store with sample product data
 */

const Product = require('../models/Product');
const productStore = require('../models/ProductStore');

const sampleProducts = [
  // iPhones
  {
    title: 'iPhone 16 Pro Max',
    description: '6.9-inch Super Retina XDR display, A18 Pro chip, 12MP main + 12MP ultra-wide + 12MP telephoto cameras, 8GB RAM, 256GB storage, advanced computational photography',
    price: 119999,
    mrp: 129999,
    rating: 4.8,
    stock: 45,
    category: 'Mobile Phones',
    brand: 'Apple',
    salesCount: 2340,
    returnRate: 2.1,
    complaintCount: 5,
    metadata: {
      ram: '8GB',
      storage: '256GB',
      screensize: '6.9 inches',
      model: 'iPhone 16 Pro Max',
      color: 'Space Black',
      processor: 'A18 Pro',
      battery: '4685 mAh'
    }
  },
  {
    title: 'iPhone 16 Pro',
    description: '6.3-inch Super Retina XDR display, A18 Pro chip, 12MP dual rear cameras, 12MP front camera with Center Stage, 8GB RAM, 128GB storage',
    price: 99999,
    mrp: 109999,
    rating: 4.7,
    stock: 78,
    category: 'Mobile Phones',
    brand: 'Apple',
    salesCount: 3120,
    returnRate: 2.3,
    complaintCount: 8,
    metadata: {
      ram: '8GB',
      storage: '128GB',
      screensize: '6.3 inches',
      model: 'iPhone 16 Pro',
      color: 'Black',
      processor: 'A18 Pro',
      battery: '3582 mAh'
    }
  },
  {
    title: 'iPhone 15',
    description: '6.1-inch Liquid Retina display, A17 Pro chip, 48MP main camera, 12MP ultra-wide camera, 12MP front camera, Ceramic Shield',
    price: 69999,
    mrp: 79999,
    rating: 4.6,
    stock: 120,
    category: 'Mobile Phones',
    brand: 'Apple',
    salesCount: 5630,
    returnRate: 2.8,
    complaintCount: 15,
    metadata: {
      ram: '6GB',
      storage: '128GB',
      screensize: '6.1 inches',
      model: 'iPhone 15',
      color: 'Blue',
      processor: 'A17 Pro',
      battery: '3349 mAh'
    }
  },
  {
    title: 'iPhone 15 Plus',
    description: '6.7-inch Liquid Retina display, A17 Pro chip, dual camera system, all-day battery life, Ceramic Shield front and back',
    price: 79999,
    mrp: 89999,
    rating: 4.5,
    stock: 95,
    category: 'Mobile Phones',
    brand: 'Apple',
    salesCount: 3450,
    returnRate: 2.5,
    complaintCount: 9,
    metadata: {
      ram: '6GB',
      storage: '128GB',
      screensize: '6.7 inches',
      model: 'iPhone 15 Plus',
      color: 'Green',
      processor: 'A17 Pro',
      battery: '3852 mAh'
    }
  },

  // Samsung Phones
  {
    title: 'Samsung Galaxy S24 Ultra',
    description: '6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3, 50MP main camera with 200MP telephoto, 12GB RAM, Galaxy AI features',
    price: 129999,
    mrp: 139999,
    rating: 4.7,
    stock: 65,
    category: 'Mobile Phones',
    brand: 'Samsung',
    salesCount: 2890,
    returnRate: 2.2,
    complaintCount: 6,
    metadata: {
      ram: '12GB',
      storage: '256GB',
      screensize: '6.8 inches',
      model: 'Galaxy S24 Ultra',
      color: 'Titanium Gray',
      processor: 'Snapdragon 8 Gen 3',
      battery: '5000 mAh'
    }
  },
  {
    title: 'Samsung Galaxy S24',
    description: '6.2-inch Dynamic AMOLED display, Snapdragon 8 Gen 3, 50MP main + 12MP telephoto cameras, 8GB RAM, One UI with Galaxy AI',
    price: 79999,
    mrp: 89999,
    rating: 4.6,
    stock: 140,
    category: 'Mobile Phones',
    brand: 'Samsung',
    salesCount: 4560,
    returnRate: 2.4,
    complaintCount: 11,
    metadata: {
      ram: '8GB',
      storage: '128GB',
      screensize: '6.2 inches',
      model: 'Galaxy S24',
      color: 'Onyx Black',
      processor: 'Snapdragon 8 Gen 3',
      battery: '4000 mAh'
    }
  },

  // Budget Phones
  {
    title: 'Samsung Galaxy A15',
    description: '6.5-inch Super AMOLED display, MediaTek Helio G99, 50MP main camera, 5000mAh battery, 90Hz refresh rate, excellent for budget users',
    price: 15999,
    mrp: 19999,
    rating: 4.3,
    stock: 300,
    category: 'Mobile Phones',
    brand: 'Samsung',
    salesCount: 8900,
    returnRate: 3.2,
    complaintCount: 25,
    metadata: {
      ram: '4GB',
      storage: '128GB',
      screensize: '6.5 inches',
      model: 'Galaxy A15',
      color: 'Midnight Black',
      processor: 'MediaTek Helio G99',
      battery: '5000 mAh'
    }
  },
  {
    title: 'Redmi 12',
    description: '6.79-inch LCD display, MediaTek Helio G88, 50MP main camera, 5000mAh battery with 18W charging, stereo speakers',
    price: 12999,
    mrp: 16999,
    rating: 4.2,
    stock: 250,
    category: 'Mobile Phones',
    brand: 'Xiaomi',
    salesCount: 7650,
    returnRate: 3.5,
    complaintCount: 20,
    metadata: {
      ram: '4GB',
      storage: '128GB',
      screensize: '6.79 inches',
      model: 'Redmi 12',
      color: 'Sky Blue',
      processor: 'MediaTek Helio G88',
      battery: '5000 mAh'
    }
  },

  // Laptops
  {
    title: 'MacBook Pro 16-inch M3 Max',
    description: '16-inch Liquid Retina XDR display, M3 Max chip, 36GB unified memory, 512GB SSD, 12-core GPU, pro-grade performance',
    price: 249999,
    mrp: 269999,
    rating: 4.9,
    stock: 25,
    category: 'Laptops',
    brand: 'Apple',
    salesCount: 450,
    returnRate: 1.2,
    complaintCount: 1,
    metadata: {
      ram: '36GB',
      storage: '512GB SSD',
      screensize: '16 inches',
      processor: 'M3 Max',
      gpu: '12-core GPU',
      battery: 'Up to 18 hours',
      weight: '2.15 kg'
    }
  },
  {
    title: 'Dell XPS 15',
    description: '15.6-inch OLED display, Intel Core i7-13700H, RTX 4070, 16GB RAM, 512GB SSD, premium build quality',
    price: 179999,
    mrp: 199999,
    rating: 4.6,
    stock: 40,
    category: 'Laptops',
    brand: 'Dell',
    salesCount: 890,
    returnRate: 2.1,
    complaintCount: 4,
    metadata: {
      ram: '16GB',
      storage: '512GB SSD',
      screensize: '15.6 inches',
      processor: 'Intel i7-13700H',
      gpu: 'RTX 4070',
      battery: '9+ hours',
      weight: '2.1 kg'
    }
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon',
    description: '14-inch FHD display, Intel Core i7, 16GB RAM, 512GB SSD, lightweight, excellent keyboard, business-focused',
    price: 139999,
    mrp: 159999,
    rating: 4.5,
    stock: 55,
    category: 'Laptops',
    brand: 'Lenovo',
    salesCount: 1200,
    returnRate: 1.8,
    complaintCount: 3,
    metadata: {
      ram: '16GB',
      storage: '512GB SSD',
      screensize: '14 inches',
      processor: 'Intel Core i7',
      gpu: 'Integrated Intel Iris',
      battery: '15+ hours',
      weight: '1.27 kg'
    }
  },

  // Headphones
  {
    title: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation, 30-hour battery, premium sound quality, multipoint connection, comfortable fit for long hours',
    price: 29999,
    mrp: 34999,
    rating: 4.8,
    stock: 180,
    category: 'Headphones',
    brand: 'Sony',
    salesCount: 4560,
    returnRate: 1.5,
    complaintCount: 5,
    metadata: {
      type: 'Over-ear',
      noiseCancellation: 'ANC',
      battery: '30 hours',
      bluetooth: '5.3',
      drivers: '40mm',
      weight: '250g',
      colors: 'Black, Silver'
    }
  },
  {
    title: 'Apple AirPods Pro 2',
    description: 'Active noise cancellation, adaptive audio, personalized sound, spatial audio with head tracking, 6-hour battery',
    price: 26999,
    mrp: 29999,
    rating: 4.7,
    stock: 200,
    category: 'Headphones',
    brand: 'Apple',
    salesCount: 5670,
    returnRate: 2.2,
    complaintCount: 8,
    metadata: {
      type: 'True Wireless',
      noiseCancellation: 'ANC',
      battery: '6 hours (30 hours with case)',
      bluetooth: '5.3',
      drivers: 'Custom Apple audio drivers',
      weight: '4.3g per earbud',
      colors: 'White'
    }
  },

  // Phone Accessories
  {
    title: 'iPhone 16 Pro Max Leather Case',
    description: 'Premium leather case with MagSafe, scratch-resistant, elegant design, perfect protection for your iPhone 16 Pro Max',
    price: 4999,
    mrp: 5999,
    rating: 4.6,
    stock: 500,
    category: 'Phone Accessories',
    brand: 'Apple',
    salesCount: 8900,
    returnRate: 1.2,
    complaintCount: 3,
    metadata: {
      material: 'Genuine Leather',
      type: 'Case',
      magSafe: 'Yes',
      compatibility: 'iPhone 16 Pro Max',
      color: 'Black'
    }
  },
  {
    title: 'ANKER 65W USB-C Fast Charger',
    description: 'Compact 65W USB-C charger, supports fast charging for phones, tablets, and laptops, multiple port options',
    price: 2999,
    mrp: 3999,
    rating: 4.5,
    stock: 800,
    category: 'Phone Accessories',
    brand: 'ANKER',
    salesCount: 12340,
    returnRate: 1.8,
    complaintCount: 5,
    metadata: {
      wattage: '65W',
      ports: 'USB-C',
      compatibility: 'Universal',
      size: 'Compact',
      warranty: '18 months'
    }
  },
  {
    title: 'Spigen Tempered Glass Screen Protector',
    description: 'Durable tempered glass, 9H hardness, anti-fingerprint coating, easy installation, fits multiple phone models',
    price: 399,
    mrp: 599,
    rating: 4.4,
    stock: 1200,
    category: 'Phone Accessories',
    brand: 'Spigen',
    salesCount: 18900,
    returnRate: 2.5,
    complaintCount: 12,
    metadata: {
      material: 'Tempered Glass',
      hardness: '9H',
      thickness: '0.33mm',
      compatibility: 'Multiple Models',
      features: 'Anti-fingerprint'
    }
  }
];

/**
 * Initialize the product store with sample data
 */
function initializeProductStore() {
  console.log('Initializing product store with sample data...');
  
  sampleProducts.forEach(productData => {
    const product = new Product(productData);
    productStore.addProduct(product);
  });

  const stats = productStore.getStatistics();
  console.log('✅ Product store initialized');
  console.log(`📊 Loaded ${stats.totalProducts} products across ${stats.totalCategories} categories`);
  console.log(`💰 Total inventory value: ₹${stats.totalValue.toLocaleString('en-IN')}`);
  
  return stats;
}

/**
 * Reset product store (for testing)
 */
function resetProductStore() {
  productStore.clear();
  console.log('Product store reset');
}

module.exports = {
  initializeProductStore,
  resetProductStore,
  sampleProducts
};
