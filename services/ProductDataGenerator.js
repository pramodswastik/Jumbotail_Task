/**
 * Product Data Generator
 * Generates synthetic but realistic product data for the e-commerce catalog
 * Creates 1000+ products across multiple categories with realistic attributes
 */

/**
 * Generate random rating between 3.5 and 5.0 (normally distributed)
 */
function generateRating() {
  // Normal distribution around 4.2 with some variation
  const mean = 4.2;
  const stdDev = 0.4;
  let rating = mean + (Math.random() + Math.random() + Math.random() + Math.random() - 2) * stdDev;
  return Math.min(5, Math.max(3.5, parseFloat(rating.toFixed(1))));
}

/**
 * Generate realistic stock levels
 */
function generateStock() {
  const random = Math.random();
  if (random < 0.1) return 0; // 10% out of stock
  if (random < 0.3) return Math.floor(Math.random() * 50); // Low stock 20%
  if (random < 0.6) return 50 + Math.floor(Math.random() * 150); // Medium stock 30%
  return 150 + Math.floor(Math.random() * 350); // High stock 40%
}

/**
 * Generate realistic return rate (0-5%)
 */
function generateReturnRate() {
  return parseFloat((Math.random() * 5).toFixed(1));
}

/**
 * Generate realistic sales count
 */
function generateSalesCount() {
  const random = Math.random();
  if (random < 0.3) return Math.floor(Math.random() * 100);
  if (random < 0.6) return 100 + Math.floor(Math.random() * 500);
  return 500 + Math.floor(Math.random() * 5000);
}

/**
 * Mobile Phones Data
 */
function generateMobilePhones() {
  const phones = [];

  // iPhone variants
  const iPhoneModels = [
    { model: 'iPhone 16', basePrice: 79999, colors: ['Black', 'White', 'Blue', 'Green'] },
    { model: 'iPhone 16 Plus', basePrice: 89999, colors: ['Black', 'White', 'Blue', 'Green'] },
    { model: 'iPhone 16 Pro', basePrice: 99999, colors: ['Black', 'White', 'Gold', 'Space Black'] },
    { model: 'iPhone 16 Pro Max', basePrice: 119999, colors: ['Black', 'White', 'Gold', 'Space Black'] },
    { model: 'iPhone 15', basePrice: 69999, colors: ['Black', 'Blue', 'Green', 'Pink'] },
    { model: 'iPhone 15 Plus', basePrice: 79999, colors: ['Black', 'Blue', 'Green', 'Pink'] }
  ];

  iPhoneModels.forEach(({ model, basePrice, colors }) => {
    const storages = [128, 256, 512];
    storages.forEach(storage => {
      colors.forEach(color => {
        const priceVariation = (storage - 128) * 10000;
        const price = basePrice + priceVariation;
        const mrp = price + Math.floor(Math.random() * 5000 + 1000);

        phones.push({
          title: `${model} ${storage}GB ${color}`,
          description: `Latest ${model} with ${storage}GB storage in beautiful ${color} color. Features advanced camera system, long battery life, and A-series chip.`,
          price: price,
          mrp: mrp,
          rating: generateRating(),
          stock: generateStock(),
          category: 'Mobile Phones',
          brand: 'Apple',
          salesCount: generateSalesCount(),
          returnRate: generateReturnRate(),
          complaintCount: Math.floor(generateReturnRate() * 10),
          metadata: {
            ram: '8GB',
            storage: `${storage}GB`,
            screensize: model.includes('Plus') ? '6.7 inches' : '6.1 inches',
            model: model,
            color: color,
            processor: model.includes('Pro') ? 'A18 Pro' : 'A18',
            battery: model.includes('Plus') ? '3582 mAh' : '3349 mAh'
          }
        });
      });
    });
  });

  // Samsung Galaxy variants
  const samsungModels = [
    { model: 'Galaxy S24', basePrice: 79999, colors: ['Onyx Black', 'Marble Gray', 'Amber Gold', 'Cobalt Violet'] },
    { model: 'Galaxy S24+', basePrice: 99999, colors: ['Onyx Black', 'Marble Gray', 'Amber Gold', 'Cobalt Violet'] },
    { model: 'Galaxy S24 Ultra', basePrice: 129999, colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Orange'] },
    { model: 'Galaxy A15', basePrice: 15999, colors: ['Black', 'Blue', 'Green', 'Gold'] },
    { model: 'Galaxy A25', basePrice: 19999, colors: ['Black', 'Blue', 'Green', 'Orange'] },
    { model: 'Galaxy A35', basePrice: 29999, colors: ['Black', 'Blue', 'Purple', 'Silver'] }
  ];

  samsungModels.forEach(({ model, basePrice, colors }) => {
    colors.forEach(color => {
      const price = basePrice;
      const mrp = price + Math.floor(Math.random() * 5000 + 1000);

      phones.push({
        title: `Samsung ${model} ${color}`,
        description: `Experience the power of Samsung ${model} in stunning ${color}. Featuring advanced processor, great display, and exceptional battery life.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Mobile Phones',
        brand: 'Samsung',
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 10),
        metadata: {
          ram: model.includes('Ultra') ? '12GB' : model.includes('Plus') ? '12GB' : model.includes('A35') ? '6GB' : '4GB',
          storage: model.includes('Ultra') ? '256GB' : '128GB',
          screensize: model.includes('Ultra') ? '6.8 inches' : model.includes('Plus') ? '6.7 inches' : '6.2 inches',
          model: model,
          color: color,
          processor: 'Snapdragon 8 Gen 3',
          battery: '5000 mAh'
        }
      });
    });
  });

  // Xiaomi Redmi variants
  const redmiModels = [
    { model: 'Redmi 13', basePrice: 11999, colors: ['Midnight Black', 'Emerald Green', 'Matte Silver'] },
    { model: 'Redmi 13C', basePrice: 9999, colors: ['Black', 'Green', 'Blue'] },
    { model: 'Redmi 12', basePrice: 12999, colors: ['Sky Blue', 'Midnight Black', 'Coral Orange'] },
    { model: 'Redmi Note 13', basePrice: 17999, colors: ['Midnight Black', 'Coral Orange', 'Glacier White'] }
  ];

  redmiModels.forEach(({ model, basePrice, colors }) => {
    colors.forEach(color => {
      const price = basePrice;
      const mrp = price + Math.floor(Math.random() * 3000 + 500);

      phones.push({
        title: `Xiaomi ${model} ${color}`,
        description: `Affordable Xiaomi ${model} with impressive features in ${color}. Great for everyday use with excellent value for money.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Mobile Phones',
        brand: 'Xiaomi',
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 10),
        metadata: {
          ram: '4GB',
          storage: '128GB',
          screensize: '6.79 inches',
          model: model,
          color: color,
          processor: 'MediaTek Helio G88',
          battery: '5000 mAh'
        }
      });
    });
  });

  return phones;
}

/**
 * Laptops Data
 */
function generateLaptops() {
  const laptops = [];

  const laptopModels = [
    { brand: 'Apple', model: 'MacBook Pro 16', basePrice: 249999, processor: 'M3 Max' },
    { brand: 'Apple', model: 'MacBook Pro 14', basePrice: 199999, processor: 'M3 Max' },
    { brand: 'Apple', model: 'MacBook Air 15', basePrice: 129999, processor: 'M3' },
    { brand: 'Apple', model: 'MacBook Air 13', basePrice: 99999, processor: 'M3' },
    { brand: 'Dell', model: 'XPS 15', basePrice: 179999, processor: 'Intel i7-13' },
    { brand: 'Dell', model: 'XPS 13', basePrice: 119999, processor: 'Intel i7-13' },
    { brand: 'Dell', model: 'Inspiron 15', basePrice: 59999, processor: 'Intel i5' },
    { brand: 'Lenovo', model: 'ThinkPad X1 Carbon', basePrice: 139999, processor: 'Intel i7' },
    { brand: 'Lenovo', model: 'ThinkPad L14', basePrice: 89999, processor: 'Intel i5' },
    { brand: 'HP', model: 'Pavilion 15', basePrice: 54999, processor: 'AMD Ryzen 5' },
    { brand: 'ASUS', model: 'VivoBook 15', basePrice: 49999, processor: 'AMD Ryzen 5' }
  ];

  laptopModels.forEach(({ brand, model, basePrice, processor }) => {
    const colors = ['Silver', 'Space Gray', 'Gold'];
    colors.forEach(color => {
      const price = basePrice;
      const mrp = price + Math.floor(Math.random() * 10000 + 2000);

      laptops.push({
        title: `${brand} ${model} ${color}`,
        description: `Professional ${brand} ${model} laptop in ${color} finish. Equipped with ${processor} processor, excellent display, and all-day battery life. Perfect for work, study, and entertainment.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Laptops',
        brand: brand,
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 8),
        metadata: {
          ram: brand === 'Apple' ? '16GB' : '8GB',
          storage: '512GB SSD',
          screensize: model.includes('15') ? '15.6 inches' : '13.3 inches',
          processor: processor,
          gpu: 'Integrated Graphics',
          battery: '8-10 hours',
          weight: '1.8 kg'
        }
      });
    });
  });

  return laptops;
}

/**
 * Headphones Data
 */
function generateHeadphones() {
  const headphones = [];

  const headphoneModels = [
    { brand: 'Sony', model: 'WH-1000XM5', basePrice: 29999, type: 'Over-ear' },
    { brand: 'Sony', model: 'WH-1000XM4', basePrice: 24999, type: 'Over-ear' },
    { brand: 'Apple', model: 'AirPods Pro 2', basePrice: 26999, type: 'True Wireless' },
    { brand: 'Apple', model: 'AirPods Max', basePrice: 54999, type: 'Over-ear' },
    { brand: 'JBL', model: 'Tune 750', basePrice: 12999, type: 'Over-ear' },
    { brand: 'Bose', model: 'QuietComfort 45', basePrice: 34999, type: 'Over-ear' },
    { brand: 'Sennheiser', model: 'Momentum 4', basePrice: 24999, type: 'Over-ear' },
    { brand: 'Boat', model: 'Nirvana Ion', basePrice: 4999, type: 'True Wireless' },
    { brand: 'Boat', model: 'Immortal 1000D', basePrice: 999, type: 'Wired' }
  ];

  headphoneModels.forEach(({ brand, model, basePrice, type }) => {
    const colors = ['Black', 'White', 'Blue'];
    colors.forEach(color => {
      const price = basePrice;
      const mrp = price + Math.floor(Math.random() * 5000 + 1000);

      headphones.push({
        title: `${brand} ${model} ${color}`,
        description: `Premium ${brand} ${model} headphones in ${color}. Features active noise cancellation, superior sound quality, and long battery life. Perfect for music lovers and professionals.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Headphones',
        brand: brand,
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 8),
        metadata: {
          type: type,
          noiseCancellation: basePrice > 10000 ? 'ANC' : 'None',
          battery: basePrice > 10000 ? '30 hours' : '5 hours',
          bluetooth: '5.3',
          drivers: '40mm',
          weight: '250g',
          color: color
        }
      });
    });
  });

  return headphones;
}

/**
 * Phone Accessories Data
 */
function generateAccessories() {
  const accessories = [];

  const accessoryTypes = [
    // Cases
    { type: 'Case', brand: 'Apple', basePrice: 4999, models: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15'] },
    { type: 'Case', brand: 'Spigen', basePrice: 999, models: ['iPhone 16', 'iPhone 15', 'Samsung S24'] },
    { type: 'Case', brand: 'OtterBox', basePrice: 3999, models: ['iPhone 16', 'Samsung S24'] },

    // Screen Protectors
    { type: 'Screen Protector', brand: 'Spigen', basePrice: 399, models: ['iPhone 16', 'iPhone 15', 'Samsung S24'] },
    { type: 'Screen Protector', brand: 'IQ Shield', basePrice: 499, models: ['iPhone 16', 'Samsung S24'] },

    // Chargers
    { type: 'Charger', brand: 'ANKER', basePrice: 2999, models: ['Universal 65W'] },
    { type: 'Charger', brand: 'Belkin', basePrice: 3499, models: ['Universal 68W'] },
    { type: 'Charger', brand: 'Apple', basePrice: 5999, models: ['iPhone 16'] },

    // Cables
    { type: 'Cable', brand: 'ANKER', basePrice: 599, models: ['USB-C'] },
    { type: 'Cable', brand: 'Belkin', basePrice: 799, models: ['USB-C'] },

    // Power Banks
    { type: 'Power Bank', brand: 'ANKER', basePrice: 3999, models: ['20000 mAh'] },
    { type: 'Power Bank', brand: 'MI', basePrice: 1999, models: ['10000 mAh'] }
  ];

  accessoryTypes.forEach(({ type, brand, basePrice, models }) => {
    models.forEach(model => {
      const price = basePrice + Math.floor(Math.random() * 1000);
      const mrp = price + Math.floor(Math.random() * 1500 + 500);

      accessories.push({
        title: `${brand} ${type} for ${model}`,
        description: `High-quality ${brand} ${type} designed for ${model}. Premium build quality, long-lasting, and perfect fit. Protect your device with style.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Phone Accessories',
        brand: brand,
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 5),
        metadata: {
          type: type,
          compatibility: model,
          material: type === 'Case' ? 'Silicone/TPU' : 'Tempered Glass',
          color: ['Black', 'White', 'Blue', 'Red'][Math.floor(Math.random() * 4)]
        }
      });
    });
  });

  return accessories;
}

/**
 * Tablets Data
 */
function generateTablets() {
  const tablets = [];

  const tabletModels = [
    { brand: 'Apple', model: 'iPad Pro 12.9', basePrice: 129999, storage: '256GB' },
    { brand: 'Apple', model: 'iPad Pro 11', basePrice: 99999, storage: '256GB' },
    { brand: 'Apple', model: 'iPad Air', basePrice: 79999, storage: '128GB' },
    { brand: 'Samsung', model: 'Galaxy Tab S9 Ultra', basePrice: 119999, storage: '256GB' },
    { brand: 'Samsung', model: 'Galaxy Tab S9', basePrice: 79999, storage: '128GB' },
    { brand: 'Lenovo', model: 'Tab Pen Pro', basePrice: 39999, storage: '128GB' }
  ];

  tabletModels.forEach(({ brand, model, basePrice, storage }) => {
    const colors = ['Silver', 'Space Gray', 'Blue'];
    colors.forEach(color => {
      const price = basePrice;
      const mrp = price + Math.floor(Math.random() * 8000 + 2000);

      tablets.push({
        title: `${brand} ${model} ${color}`,
        description: `Powerful ${brand} ${model} tablet in ${color}. Featuring high-resolution display, impressive processing power, and long battery life. Ideal for productivity and entertainment.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Tablets',
        brand: brand,
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 6),
        metadata: {
          storage: storage,
          screensize: '12.9 inches',
          processor: brand === 'Apple' ? 'M2' : 'Snapdragon',
          battery: '10+ hours',
          color: color
        }
      });
    });
  });

  return tablets;
}

/**
 * Smart Watches Data
 */
function generateSmartWatches() {
  const watches = [];

  const watchModels = [
    { brand: 'Apple', model: 'Apple Watch Series 9', basePrice: 39999 },
    { brand: 'Apple', model: 'Apple Watch Ultra', basePrice: 79999 },
    { brand: 'Samsung', model: 'Galaxy Watch 6', basePrice: 24999 },
    { brand: 'Garmin', model: 'Fenix 7', basePrice: 54999 },
    { brand: 'Fitbit', model: 'Sense 2', basePrice: 29999 }
  ];

  watchModels.forEach(({ brand, model, basePrice }) => {
    const colors = ['Black', 'Silver', 'Gold'];
    colors.forEach(color => {
      const price = basePrice;
      const mrp = price + Math.floor(Math.random() * 5000 + 1000);

      watches.push({
        title: `${brand} ${model} ${color}`,
        description: `Advanced ${brand} ${model} smartwatch in ${color}. Track fitness, monitor health, stay connected, and manage your daily tasks with this feature-rich device.`,
        price: price,
        mrp: mrp,
        rating: generateRating(),
        stock: generateStock(),
        category: 'Smart Watches',
        brand: brand,
        salesCount: generateSalesCount(),
        returnRate: generateReturnRate(),
        complaintCount: Math.floor(generateReturnRate() * 5),
        metadata: {
          size: '40mm',
          battery: '18 hours',
          waterResistance: '5 ATM',
          color: color,
          display: 'AMOLED'
        }
      });
    });
  });

  return watches;
}

/**
 * Generate complete product catalog
 */
function generateCompleteCatalog() {
  console.log('🔄 Generating product catalog...');
  
  const allProducts = [
    ...generateMobilePhones(),
    ...generateLaptops(),
    ...generateHeadphones(),
    ...generateAccessories(),
    ...generateTablets(),
    ...generateSmartWatches()
  ];

  console.log(`✅ Generated ${allProducts.length} products`);
  
  return allProducts;
}

module.exports = {
  generateMobilePhones,
  generateLaptops,
  generateHeadphones,
  generateAccessories,
  generateTablets,
  generateSmartWatches,
  generateCompleteCatalog
};
