/**
 * Web Scraper Service
 * Fetches product data from external sources (Flipkart, Amazon)
 */

const axios = require('axios');
const cheerio = require('cheerio');

class WebScraper {
  /**
   * Scrape products from multiple sources based on search query
   * @param {string} searchQuery - Product search query
   * @returns {Promise<Array>} Array of scraped products
   */
  static async scrapeProducts(searchQuery) {
    const products = [];
    
    try {
      console.log(`🔍 Fetching products for: "${searchQuery}"`);
      
      const results = await Promise.allSettled([
        this.scrapeFlipkart(searchQuery),
        this.scrapeAmazon(searchQuery)
      ]);

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          products.push(...result.value);
        }
      });
      
      console.log(`✅ Retrieved ${products.length} products from external sources`);
      
      // Deduplicate similar products
      return this.deduplicateProducts(products);
    } catch (error) {
      console.error('Web scraping error:', error.message);
      return [];
    }
  }

  /**
   * Scrape products from Flipkart
   * @param {string} searchQuery - Product search query
   * @returns {Promise<Array>} Array of products
   */
  static async scrapeFlipkart(searchQuery) {
    try {
      const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
      let products = [];

      try {
        const html = await this.fetchHtml(url);
        products = this.parseFlipkartContent(html);
      } catch (error) {
        console.warn(`Flipkart direct fetch blocked: ${error.message}`);
      }

      if (products.length === 0) {
        try {
          const proxyHtml = await this.fetchHtml(this.toJinaUrl(url));
          products = this.parseFlipkartContent(proxyHtml);
        } catch (error) {
          console.warn(`Flipkart proxy fetch failed: ${error.message}`);
        }
      }

      return products;
    } catch (error) {
      console.error(`Flipkart scraping failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Scrape products from Amazon India
   * @param {string} searchQuery - Product search query
   * @returns {Promise<Array>} Array of products
   */
  static async scrapeAmazon(searchQuery) {
    try {
      const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
      let products = [];

      try {
        const html = await this.fetchHtml(url);
        products = this.parseAmazonContent(html);
      } catch (error) {
        console.warn(`Amazon direct fetch blocked: ${error.message}`);
      }

      if (products.length === 0) {
        try {
          const proxyHtml = await this.fetchHtml(this.toJinaUrl(url));
          products = this.parseAmazonContent(proxyHtml);
        } catch (error) {
          console.warn(`Amazon proxy fetch failed: ${error.message}`);
        }
      }

      return products;
    } catch (error) {
      console.error(`Amazon scraping failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Scrape from Jio Mart (Not implemented)
   * @param {string} searchQuery - Product search query
   * @returns {Promise<Array>} Array of products
   */
  static async scrapeJioMart(searchQuery) {
    return [];
  }

  static async fetchHtml(url) {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    const response = await axios.get(url, {
      headers,
      timeout: 15000,
      validateStatus: status => status >= 200 && status < 400
    });

    return response.data || '';
  }

  static toJinaUrl(url) {
    const stripped = String(url || '').replace(/^https?:\/\//, '');
    return `https://r.jina.ai/http://${stripped}`;
  }

  static isMarkdownContent(content) {
    return typeof content === 'string' && content.includes('Markdown Content:');
  }

  static parseAmazonContent(content) {
    if (this.isMarkdownContent(content)) {
      return this.parseAmazonMarkdown(content);
    }

    return this.parseAmazonHtml(content);
  }

  static parseFlipkartContent(content) {
    if (this.isMarkdownContent(content)) {
      return this.parseFlipkartMarkdown(content);
    }

    return this.parseFlipkartHtml(content);
  }

  static parseFlipkartHtml(html) {
    if (!html) return [];
    const $ = cheerio.load(html);
    const products = [];

    $('div._1AtVbE').each((_, element) => {
      const title =
        $(element).find('div._4rR01T').first().text().trim() ||
        $(element).find('a.s1Q9rs').first().text().trim() ||
        $(element).find('a.IRpwTa').first().text().trim();

      const priceText = $(element).find('div._30jeq3').first().text().trim();
      const mrpText = $(element).find('div._3I9_wc').first().text().trim();
      const ratingText = $(element).find('div._3LWZlK').first().text().trim();

      const image =
        $(element).find('img._396cs4').attr('src') ||
        $(element).find('img._2r_T1I').attr('src') ||
        $(element).find('img._396cs4').attr('data-src') ||
        $(element).find('img._2r_T1I').attr('data-src');

      const link =
        $(element).find('a._1fQZEK').attr('href') ||
        $(element).find('a.s1Q9rs').attr('href') ||
        $(element).find('a.IRpwTa').attr('href');

      if (!title || !priceText) return;

      const price = this.extractPrice(priceText);
      const mrp = this.extractPrice(mrpText) || price;
      const rating = this.extractRating(ratingText);
      const productUrl = link ? `https://www.flipkart.com${link}` : null;

      if (!price) return;

      products.push(this.buildProduct({
        title,
        price,
        mrp,
        rating,
        image,
        source: 'Flipkart',
        url: productUrl
      }));
    });

    return products;
  }

  static parseAmazonHtml(html) {
    if (!html) return [];
    const $ = cheerio.load(html);
    const products = [];

    $('div.s-result-item[data-component-type="s-search-result"]').each((_, element) => {
      const title = $(element).find('h2 a span').first().text().trim();
      const priceText = $(element).find('span.a-price > span.a-offscreen').first().text().trim();
      const mrpText = $(element).find('span.a-text-price > span.a-offscreen').first().text().trim();
      const ratingText = $(element).find('span.a-icon-alt').first().text().trim();
      const image = $(element).find('img.s-image').attr('src');
      const link = $(element).find('h2 a').attr('href');

      if (!title || !priceText) return;

      const price = this.extractPrice(priceText);
      const mrp = this.extractPrice(mrpText) || price;
      const rating = this.extractRating(ratingText);
      const productUrl = link ? `https://www.amazon.in${link}` : null;

      if (!price) return;

      products.push(this.buildProduct({
        title,
        price,
        mrp,
        rating,
        image,
        source: 'Amazon India',
        url: productUrl
      }));
    });

    return products;
  }

  static parseAmazonMarkdown(markdown) {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    const products = [];
    let current = null;

    const flush = () => {
      if (current && current.title && current.price) {
        products.push(this.buildProduct(current));
      }
      current = null;
    };

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;

      const imageMatch = line.match(/!\[Image[^\]]*\]\(([^)]+)\)/i);
      const imageUrl = imageMatch ? imageMatch[1] : null;
      const imageTitleMatch = line.match(/!\[Image\s*\d+\s*:\s*([^\]]+)\]/i);

      const linkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/www\.amazon\.in\/[^)]+\/dp\/[^)]+)\)/i);

      if (imageTitleMatch && linkMatch) {
        flush();
        current = {
          title: this.sanitizeText(imageTitleMatch[1]),
          url: linkMatch[2],
          image: imageUrl,
          source: 'Amazon India'
        };
        continue;
      }

      if (linkMatch) {
        const title = this.sanitizeText(linkMatch[1]);
        if (title.length > 3) {
          flush();
          current = {
            title,
            url: linkMatch[2],
            image: imageUrl,
            source: 'Amazon India'
          };
          continue;
        }
      }

      if (line.toLowerCase().includes('price, product page[') && current) {
        const price = this.extractPrice(line);
        const mrpMatch = line.match(/M\.R\.P:\s*₹?([\d,]+)/i);
        const mrp = mrpMatch ? this.extractPrice(mrpMatch[0]) : price;
        if (price) {
          current.price = price;
          current.mrp = mrp || price;
        }
      }

      if (line.includes('out of 5 stars') && current) {
        current.rating = this.extractRating(line);
      }
    }

    flush();
    return products;
  }

  static parseFlipkartMarkdown(markdown) {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    const products = [];
    let current = null;

    const flush = () => {
      if (current && current.title && current.price) {
        products.push(this.buildProduct(current));
      }
      current = null;
    };

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;

      const imageMatch = line.match(/!\[[^\]]*\]\(([^)]+)\)/i);
      const imageUrl = imageMatch ? imageMatch[1] : null;
      const linkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/www\.flipkart\.com\/[^)]+)\)/i);

      if (linkMatch) {
        const title = this.sanitizeText(linkMatch[1]);
        if (title.length > 3) {
          flush();
          current = {
            title,
            url: linkMatch[2],
            image: imageUrl,
            source: 'Flipkart'
          };
          continue;
        }
      }

      if (line.includes('₹') && current) {
        const price = this.extractPrice(line);
        if (price) {
          current.price = price;
          current.mrp = price;
        }
      }

      if (line.toLowerCase().includes('out of 5') && current) {
        current.rating = this.extractRating(line);
      }
    }

    flush();
    return products;
  }

  /**
   * Generate realistic mock product data based on search query
   * @param {string} searchQuery - Search query
   * @param {string} source - Data source name
   * @param {number} count - Number of products to generate
   * @returns {Promise<Array>} Array of mock products
   */
  static async generateMockProducts(searchQuery, source = 'Web', count = 10) {
    const products = [];
    const query = searchQuery.toLowerCase();
    
    // Product templates based on common search terms
    const productTemplates = {
      laptop: [
        { brand: 'Dell', model: 'XPS 13', basePrice: 85000, rating: 4.5 },
        { brand: 'HP', model: 'Pavilion', basePrice: 55000, rating: 4.2 },
        { brand: 'Lenovo', model: 'ThinkPad', basePrice: 65000, rating: 4.4 },
        { brand: 'ASUS', model: 'VivoBook', basePrice: 45000, rating: 4.1 },
        { brand: 'Acer', model: 'Aspire', basePrice: 40000, rating: 4.0 },
        { brand: 'Apple', model: 'MacBook Air', basePrice: 92000, rating: 4.7 },
        { brand: 'MSI', model: 'Gaming', basePrice: 95000, rating: 4.6 },
      ],
      phone: [
        { brand: 'Samsung', model: 'Galaxy S21', basePrice: 65000, rating: 4.5 },
        { brand: 'Apple', model: 'iPhone 13', basePrice: 79900, rating: 4.7 },
        { brand: 'Apple', model: 'iPhone 14', basePrice: 84900, rating: 4.7 },
        { brand: 'Apple', model: 'iPhone 15', basePrice: 89900, rating: 4.8 },
        { brand: 'Apple', model: 'iPhone 15 Pro', basePrice: 134900, rating: 4.8 },
        { brand: 'Apple', model: 'iPhone SE', basePrice: 49900, rating: 4.4 },
        { brand: 'OnePlus', model: '9 Pro', basePrice: 55000, rating: 4.4 },
        { brand: 'Xiaomi', model: 'Mi 11', basePrice: 35000, rating: 4.3 },
        { brand: 'Realme', model: 'GT', basePrice: 28000, rating: 4.2 },
        { brand: 'Vivo', model: 'V21', basePrice: 32000, rating: 4.1 },
        { brand: 'Oppo', model: 'Reno', basePrice: 38000, rating: 4.2 },
      ],
      tablet: [
        { brand: 'Apple', model: 'iPad Air', basePrice: 54900, rating: 4.6 },
        { brand: 'Samsung', model: 'Galaxy Tab', basePrice: 38000, rating: 4.4 },
        { brand: 'Lenovo', model: 'Tab P11', basePrice: 25000, rating: 4.2 },
        { brand: 'Amazon', model: 'Fire HD', basePrice: 12000, rating: 4.0 },
        { brand: 'Microsoft', model: 'Surface Go', basePrice: 45000, rating: 4.5 },
      ],
      headphone: [
        { brand: 'Sony', model: 'WH-1000XM4', basePrice: 25000, rating: 4.6 },
        { brand: 'Bose', model: 'QuietComfort', basePrice: 28000, rating: 4.7 },
        { brand: 'JBL', model: 'Tune 750', basePrice: 8000, rating: 4.3 },
        { brand: 'boAt', model: 'Rockerz', basePrice: 3000, rating: 4.1 },
        { brand: 'Sennheiser', model: 'HD 450BT', basePrice: 12000, rating: 4.5 },
      ],
      charger: [
        { brand: 'Anker', model: 'PowerPort', basePrice: 1500, rating: 4.4 },
        { brand: 'Samsung', model: 'Fast Charger', basePrice: 1200, rating: 4.3 },
        { brand: 'Apple', model: '20W USB-C', basePrice: 1900, rating: 4.5 },
        { brand: 'Mi', model: '27W Adapter', basePrice: 600, rating: 4.2 },
        { brand: 'OnePlus', model: 'Warp Charge', basePrice: 1500, rating: 4.4 },
      ],
      camera: [
        { brand: 'Canon', model: 'EOS 1500D', basePrice: 35000, rating: 4.5 },
        { brand: 'Nikon', model: 'D3500', basePrice: 38000, rating: 4.6 },
        { brand: 'Sony', model: 'Alpha A6400', basePrice: 75000, rating: 4.7 },
        { brand: 'GoPro', model: 'Hero 9', basePrice: 45000, rating: 4.4 },
        { brand: 'Fujifilm', model: 'X-T30', basePrice: 68000, rating: 4.6 },
      ],
      watch: [
        { brand: 'Apple', model: 'Watch Series 7', basePrice: 42000, rating: 4.7 },
        { brand: 'Samsung', model: 'Galaxy Watch 4', basePrice: 23000, rating: 4.5 },
        { brand: 'Fitbit', model: 'Versa 3', basePrice: 18000, rating: 4.3 },
        { brand: 'Amazfit', model: 'GTR 3', basePrice: 12000, rating: 4.2 },
        { brand: 'Noise', model: 'ColorFit', basePrice: 3000, rating: 4.0 },
      ],
      speaker: [
        { brand: 'JBL', model: 'Flip 5', basePrice: 8000, rating: 4.4 },
        { brand: 'Sony', model: 'SRS-XB43', basePrice: 12000, rating: 4.5 },
        { brand: 'boAt', model: 'Stone 650', basePrice: 2500, rating: 4.1 },
        { brand: 'Bose', model: 'SoundLink', basePrice: 15000, rating: 4.6 },
        { brand: 'Amazon', model: 'Echo Dot', basePrice: 3500, rating: 4.3 },
      ],
    };
    
    // Find matching template - prioritize brand-specific searches
    let templates = [];
    
    // Check for brand-specific searches (like "iphone", "samsung", "oneplus")
    const brandSpecificSearch = this.findBrandSpecificProducts(query, productTemplates);
    if (brandSpecificSearch.length > 0) {
      templates = brandSpecificSearch;
    } else {
      // Fall back to category matching
      for (const [key, value] of Object.entries(productTemplates)) {
        if (query.includes(key)) {
          templates = value;
          break;
        }
      }
    }
    
    // If no specific match, use generic electronics
    if (templates.length === 0) {
      templates = [
        { brand: 'Generic', model: searchQuery, basePrice: 5000, rating: 4.0 },
        { brand: 'Brand', model: `${searchQuery} Pro`, basePrice: 8000, rating: 4.2 },
        { brand: 'Tech', model: `${searchQuery} Plus`, basePrice: 6000, rating: 4.1 },
      ];
    }
    
    // Generate products
    for (let i = 0; i < Math.min(count, templates.length); i++) {
      const template = templates[i % templates.length];
      const priceVariation = Math.random() * 0.2 - 0.1; // ±10%
      const price = Math.round(template.basePrice * (1 + priceVariation));
      const mrp = Math.round(price * (1.15 + Math.random() * 0.15)); // 15-30% discount
      
      products.push({
        title: `${template.brand} ${template.model} ${searchQuery}`,
        price: price,
        mrp: mrp,
        rating: template.rating + (Math.random() * 0.4 - 0.2), // ±0.2 variation
        brand: template.brand,
        stock: Math.floor(Math.random() * 100) + 10,
        image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(template.brand)}`,
        source: source,
        category: 'Electronics',
        description: `${template.brand} ${template.model} - High quality ${searchQuery} with excellent features`,
        currency: 'INR',
        salesCount: Math.floor(Math.random() * 1000) + 100,
        returnRate: Math.random() * 8,
        complaintCount: Math.floor(Math.random() * 15),
      });
    }
    
    return products;
  }

  /**
   * Extract price from text string
   * @param {string} priceText - Text containing price
   * @returns {number} Extracted price
   */
  static extractPrice(priceText) {
    if (!priceText) return 0;
    
    const match = priceText.match(/[\d,]+/);
    if (match) {
      const price = parseFloat(match[0].replace(/,/g, ''));
      return isNaN(price) ? 0 : price;
    }
    return 0;
  }

  /**
   * Extract rating from text string
   * @param {string} ratingText - Text containing rating
   * @returns {number} Extracted rating
   */
  static extractRating(ratingText) {
    if (!ratingText) return 0;
    const match = ratingText.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Build a normalized product object from scraped data
   * @param {Object} data - Scraped product fields
   * @returns {Object} Normalized product object
   */
  static buildProduct({ title, price, mrp, rating, image, source, url }) {
    const cleanTitle = this.sanitizeText(title);
    return {
      title: cleanTitle,
      description: cleanTitle,
      rating: rating || 0,
      stock: 0,
      price,
      mrp: mrp || price,
      currency: 'INR',
      category: 'Electronics',
      brand: this.deriveBrand(cleanTitle),
      salesCount: 0,
      returnRate: 0,
      complaintCount: 0,
      metadata: {
        source,
        url: url || null,
        image: image || null
      }
    };
  }

  /**
   * Sanitize text values
   * @param {string} value - Text to sanitize
   * @returns {string} Sanitized text
   */
  static sanitizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Derive brand from product title
   * @param {string} title - Product title
   * @returns {string} Brand name
   */
  static deriveBrand(title) {
    const firstWord = this.sanitizeText(title).split(' ')[0];
    return firstWord || 'Unknown';
  }

  /**
   * Find brand-specific products from templates
   * @param {string} query - Lowercase search query
   * @param {Object} productTemplates - Product templates object
   * @returns {Array} Matching brand-specific products
   */
  static findBrandSpecificProducts(query, productTemplates) {
    const brandKeywords = {
      'iphone': { brand: 'Apple', category: 'phone' },
      'ipad': { brand: 'Apple', category: 'tablet' },
      'macbook': { brand: 'Apple', category: 'laptop' },
      'galaxy': { brand: 'Samsung', category: 'phone' },
      'samsung': { brand: 'Samsung', category: 'phone' },
      'oneplus': { brand: 'OnePlus', category: 'phone' },
      'xiaomi': { brand: 'Xiaomi', category: 'phone' },
      'mi': { brand: 'Xiaomi', category: 'phone' },
      'realme': { brand: 'Realme', category: 'phone' },
      'vivo': { brand: 'Vivo', category: 'phone' },
      'oppo': { brand: 'Oppo', category: 'phone' },
      'dell': { brand: 'Dell', category: 'laptop' },
      'hp': { brand: 'HP', category: 'laptop' },
      'lenovo': { brand: 'Lenovo', category: 'laptop' },
      'asus': { brand: 'ASUS', category: 'laptop' },
      'acer': { brand: 'Acer', category: 'laptop' },
      'msi': { brand: 'MSI', category: 'laptop' },
      'thinkpad': { brand: 'Lenovo', category: 'laptop' },
    };

    // Check if query matches a specific brand/model keyword
    for (const [keyword, config] of Object.entries(brandKeywords)) {
      if (query.includes(keyword)) {
        const categoryTemplates = productTemplates[config.category] || [];
        const brandProducts = categoryTemplates.filter(template => 
          template.brand === config.brand
        );
        
        if (brandProducts.length > 0) {
          return brandProducts;
        }
      }
    }

    return [];
  }

  /**
   * Deduplicate products based on title similarity
   * @param {Array} products - Array of products to deduplicate
   * @returns {Array} Deduplicated products
   */
  static deduplicateProducts(products) {
    const seen = new Map();
    const deduped = [];
    
    for (const product of products) {
      const key = product.title.toLowerCase().substring(0, 30);
      
      if (!seen.has(key)) {
        seen.set(key, product);
        deduped.push(product);
      }
    }
    
    return deduped.slice(0, 20); // Limit to 20 results
  }

  /**
   * Get product suggestions based on partial query
   * @param {string} partial - Partial search query
   * @returns {Promise<Array>} Suggested products
   */
  static async getProductSuggestions(partial) {
    try {
      // Use common product categories and brands
      const suggestions = [
        { suggestion: `${partial} laptop`, count: Math.floor(Math.random() * 500) },
        { suggestion: `${partial} phone`, count: Math.floor(Math.random() * 1000) },
        { suggestion: `${partial} tablet`, count: Math.floor(Math.random() * 300) },
        { suggestion: `${partial} headphones`, count: Math.floor(Math.random() * 800) },
        { suggestion: `${partial} charger`, count: Math.floor(Math.random() * 600) }
      ];
      
      return suggestions.filter(s => s.suggestion.length > partial.length);
    } catch (error) {
      console.error('Error getting suggestions:', error.message);
      return [];
    }
  }
}

module.exports = WebScraper;
