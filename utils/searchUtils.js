/**
 * Utility Functions for the E-commerce Search Engine
 */

/**
 * Normalize text for comparison
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ''); // Remove special characters
}

/**
 * Calculate Levenshtein distance for spell correction
 * Measures the minimum edits needed to change one string into another
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Distance between strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // Deletion
        matrix[j - 1][i] + 1, // Insertion
        matrix[j - 1][i - 1] + indicator // Substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score
 */
function stringSimilarity(str1, str2) {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  const maxLen = Math.max(normalized1.length, normalized2.length);
  
  if (maxLen === 0) return 1; // Both empty strings
  
  const distance = levenshteinDistance(normalized1, normalized2);
  return 1 - distance / maxLen;
}

/**
 * Check if query matches text (exact or partial match)
 * @param {string} text - Text to search in
 * @param {string} query - Query to search for
 * @returns {boolean}
 */
function textMatches(text, query) {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  return normalizedText.includes(normalizedQuery);
}

/**
 * Extract keywords from query
 * @param {string} query - Search query
 * @returns {string[]} Array of keywords
 */
function extractKeywords(query) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'by', 'from',
    'wala', 'waali' // Hinglish stop words
  ]);

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.has(word));
}

/**
 * Detect price range from query
 * Looks for patterns like "50k", "50000", "under 50k"
 * @param {string} query - Search query
 * @returns {Object|null} {min, max} or null
 */
function extractPriceFromQuery(query) {
  // Pattern for prices like "50k", "50000", "50,000"
  const pricePattern = /(\d+(?:,\d+)?)\s*(?:k|rupees?|rs\.?)?/gi;
  const matches = query.matchAll(pricePattern);
  
  const prices = [];
  for (const match of matches) {
    let price = match[1].replace(/,/g, '');
    // Convert k to thousands
    if (match[0].toLowerCase().includes('k')) {
      price = price * 1000;
    }
    prices.push(parseInt(price));
  }

  if (prices.length === 0) return null;
  if (prices.length === 1) {
    return { min: 0, max: prices[0] };
  }
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Detect intent from query
 * Returns intent like 'budget', 'premium', 'latest', etc.
 * @param {string} query - Search query
 * @returns {string} Intent keyword
 */
function detectQueryIntent(query) {
  const lowerQuery = query.toLowerCase();

  if (/sasta|cheap|budget|affordable|under|less/.test(lowerQuery)) {
    return 'budget';
  }
  if (/premium|pro|max|high|expensive|costly/.test(lowerQuery)) {
    return 'premium';
  }
  if (/latest|new|2024|2025|2026/.test(lowerQuery)) {
    return 'latest';
  }
  if (/strong|durable|tough|good quality/.test(lowerQuery)) {
    return 'quality';
  }
  
  return 'general';
}

/**
 * Calculate relevance score for a product based on query
 * @param {Product} product - Product object
 * @param {string} query - Search query
 * @returns {number} Relevance score (0-100)
 */
function calculateRelevanceScore(product, query) {
  let score = 0;

  // Title match (highest weight)
  const titleSimilarity = stringSimilarity(product.title, query);
  score += titleSimilarity * 40;

  // Keyword matches in title and description
  const keywords = extractKeywords(query);
  let keywordMatches = 0;
  const fullText = (product.title + ' ' + product.description).toLowerCase();
  
  keywords.forEach(keyword => {
    if (fullText.includes(keyword)) {
      keywordMatches++;
    }
  });
  
  if (keywords.length > 0) {
    score += (keywordMatches / keywords.length) * 30;
  }

  // Brand match in title
  const brandMatch = textMatches(product.title, product.brand) ? 15 : 0;
  score += brandMatch;

  // Category relevance (bonus)
  const categoryBonus = 15;
  score += categoryBonus;

  return Math.min(score, 100);
}

/**
 * Format price in Indian currency style
 * @param {number} price - Price amount
 * @returns {string} Formatted price
 */
function formatIndianPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Validate product data
 * @param {Object} data - Product data to validate
 * @returns {Object} {isValid: boolean, errors: string[]}
 */
function validateProductData(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    errors.push('Price must be a non-negative number');
  }

  if (typeof data.mrp !== 'number' || data.mrp < 0) {
    errors.push('MRP must be a non-negative number');
  }

  if (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5) {
    errors.push('Rating must be a number between 0 and 5');
  }

  if (typeof data.stock !== 'number' || data.stock < 0) {
    errors.push('Stock must be a non-negative number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  normalizeText,
  levenshteinDistance,
  stringSimilarity,
  textMatches,
  extractKeywords,
  extractPriceFromQuery,
  detectQueryIntent,
  calculateRelevanceScore,
  formatIndianPrice,
  validateProductData
};
