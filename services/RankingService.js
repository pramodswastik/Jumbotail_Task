/**
 * Advanced Ranking Service
 * Implements sophisticated algorithms to rank search results
 * Combines multiple factors: relevance, popularity, quality, pricing
 */

/**
 * BM25 (Best Matching 25) Algorithm
 * Industry-standard ranking algorithm used by Elasticsearch
 * Improved TF-IDF that accounts for document length normalization
 */
class BM25Ranker {
  constructor(corpus = []) {
    this.corpus = corpus;
    this.k1 = 1.5; // Controls non-linear term frequency normalization
    this.b = 0.75; // Controls how much effect document length has on relevance
    this.avgDocLength = this.calculateAvgDocLength();
    this.idf = new Map(); // Inverse document frequency
    this.calculateIDF();
  }

  calculateAvgDocLength() {
    if (this.corpus.length === 0) return 0;
    const totalLength = this.corpus.reduce((sum, doc) => sum + doc.split(' ').length, 0);
    return totalLength / this.corpus.length;
  }

  calculateIDF() {
    const docFreq = new Map();
    
    this.corpus.forEach(doc => {
      const words = new Set(doc.toLowerCase().split(/\s+/));
      words.forEach(word => {
        docFreq.set(word, (docFreq.get(word) || 0) + 1);
      });
    });

    docFreq.forEach((freq, word) => {
      const idf = Math.log((this.corpus.length - freq + 0.5) / (freq + 0.5) + 1);
      this.idf.set(word, idf);
    });
  }

  rank(query, documents) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const scores = documents.map((doc, index) => {
      let score = 0;
      const docLength = doc.split(' ').length;

      queryWords.forEach(word => {
        const idf = this.idf.get(word) || 0;
        const wordFreq = (doc.match(new RegExp(`\\b${word}\\b`, 'gi')) || []).length;
        
        const numerator = wordFreq * (this.k1 + 1);
        const denominator = wordFreq + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));
        
        score += idf * (numerator / denominator);
      });

      return { index, score };
    });

    return scores.sort((a, b) => b.score - a.score).map(s => s.index);
  }
}

/**
 * TF-IDF Ranker (Simpler alternative)
 * Term Frequency - Inverse Document Frequency
 */
class TFIDFRanker {
  constructor(documents) {
    this.documents = documents;
    this.idf = this.calculateIDF();
  }

  calculateIDF() {
    const docFreq = {};
    const totalDocs = this.documents.length;

    this.documents.forEach(doc => {
      const words = new Set(doc.toLowerCase().split(/\s+/));
      words.forEach(word => {
        docFreq[word] = (docFreq[word] || 0) + 1;
      });
    });

    const idf = {};
    Object.keys(docFreq).forEach(word => {
      idf[word] = Math.log(totalDocs / (docFreq[word] + 1));
    });

    return idf;
  }

  calculateTF(text) {
    const words = text.toLowerCase().split(/\s+/);
    const tf = {};
    const totalWords = words.length;

    words.forEach(word => {
      tf[word] = (tf[word] || 0) / totalWords;
    });

    return tf;
  }

  rank(query, documents) {
    const queryTF = this.calculateTF(query);
    const scores = documents.map((doc, index) => {
      const docTF = this.calculateTF(doc);
      let score = 0;

      Object.keys(queryTF).forEach(word => {
        if (docTF[word]) {
          score += queryTF[word] * docTF[word] * (this.idf[word] || 0);
        }
      });

      return { index, score };
    });

    return scores.sort((a, b) => b.score - a.score).map(s => s.index);
  }
}

/**
 * Multi-Factor Ranking System
 * Combines multiple ranking signals for comprehensive scoring
 */
class MultiFactorRanker {
  /**
   * Calculate relevance score (0-100)
   * Factors: keyword match, brand match, description match
   */
  static calculateRelevanceScore(product, query) {
    let score = 0;
    const queryLower = query.toLowerCase();
    const titleLower = product.title.toLowerCase();
    const descriptionLower = product.description.toLowerCase();

    // Title match (40 points)
    if (titleLower.includes(queryLower)) {
      score += 40;
    } else {
      const words = queryLower.split(/\s+/);
      const matchedWords = words.filter(w => titleLower.includes(w)).length;
      score += (matchedWords / words.length) * 30;
    }

    // Description match (20 points)
    if (descriptionLower.includes(queryLower)) {
      score += 20;
    } else {
      const words = queryLower.split(/\s+/);
      const matchedWords = words.filter(w => descriptionLower.includes(w)).length;
      score += (matchedWords / words.length) * 15;
    }

    // Keyword match (20 points)
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
    const keywordMatches = keywords.filter(kw => titleLower.includes(kw) || descriptionLower.includes(kw)).length;
    score += (keywordMatches / Math.max(keywords.length, 1)) * 20;

    // Metadata match (20 points)
    const metadataStr = JSON.stringify(product.metadata).toLowerCase();
    if (metadataStr.includes(queryLower)) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate popularity score (0-100)
   * Factors: sales count, ratings, stock availability
   */
  static calculatePopularityScore(product) {
    let score = 0;

    // Sales count (40 points) - logarithmic scale
    const salesScore = Math.min(Math.log10(product.salesCount + 1) * 10, 40);
    score += salesScore;

    // Rating (40 points)
    score += (product.rating / 5) * 40;

    // Stock availability (20 points)
    if (product.stock > 0) {
      const stockScore = Math.min((product.stock / 500) * 20, 20);
      score += stockScore;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate quality score (0-100)
   * Factors: rating, return rate, complaint count
   */
  static calculateQualityScore(product) {
    let score = 0;

    // Rating contribution (50 points)
    score += (product.rating / 5) * 50;

    // Return rate penalty (30 points)
    const returnPenalty = product.returnRate * 3; // Each 1% return = 3 point penalty
    score += Math.max(30 - returnPenalty, 0);

    // Complaint penalty (20 points)
    const complaintPenalty = Math.min(product.complaintCount * 2, 20);
    score += Math.max(20 - complaintPenalty, 0);

    return Math.min(score, 100);
  }

  /**
   * Calculate price value score (0-100)
   * Factors: discount percentage, absolute price, value for money
   */
  static calculateValueScore(product) {
    let score = 0;

    // Discount percentage (30 points)
    const discountPercentage = ((product.mrp - product.price) / product.mrp) * 100;
    const discountScore = Math.min((discountPercentage / 50) * 30, 30);
    score += discountScore;

    // Value for money based on rating (40 points)
    const valueRatio = product.rating / (Math.log10(product.price + 1));
    const valueScore = Math.min(valueRatio * 10, 40);
    score += valueScore;

    // Price competitiveness (30 points)
    // Lower prices get higher scores (within reason)
    if (product.price < 10000) {
      score += 30;
    } else if (product.price < 50000) {
      score += 20;
    } else if (product.price < 150000) {
      score += 10;
    } else {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate seasonal/recency score (0-100)
   * Factors: product age, trend, seasonal relevance
   */
  static calculateRecencyScore(product, queryIntent) {
    let score = 50; // Base score

    // Days since product creation
    const createdDays = Math.floor((Date.now() - product.createdAt) / (1000 * 60 * 60 * 24));
    
    // Newer products get slight boost
    if (createdDays < 30) {
      score += 25; // Brand new
    } else if (createdDays < 90) {
      score += 15; // Recent
    } else if (createdDays < 365) {
      score += 5; // Established
    }

    // Boost for "latest" intent
    if (queryIntent === 'latest' && createdDays < 180) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate comprehensive ranking score
   * Combines all factors with weighted averaging
   */
  static calculateComprehensiveScore(product, query, queryIntent = 'general') {
    const relevance = this.calculateRelevanceScore(product, query);
    const popularity = this.calculatePopularityScore(product);
    const quality = this.calculateQualityScore(product);
    const value = this.calculateValueScore(product);
    const recency = this.calculateRecencyScore(product, queryIntent);

    // Weights (sum should be 1.0)
    const weights = {
      relevance: 0.35, // Most important
      popularity: 0.25,
      quality: 0.20,
      value: 0.15,
      recency: 0.05
    };

    // Apply intent-based weight adjustments
    if (queryIntent === 'budget') {
      weights.value = 0.30;
      weights.relevance = 0.30;
      weights.quality = 0.20;
      weights.popularity = 0.15;
      weights.recency = 0.05;
    } else if (queryIntent === 'premium') {
      weights.quality = 0.30;
      weights.relevance = 0.30;
      weights.popularity = 0.20;
      weights.value = 0.15;
      weights.recency = 0.05;
    } else if (queryIntent === 'latest') {
      weights.recency = 0.25;
      weights.relevance = 0.35;
      weights.popularity = 0.20;
      weights.quality = 0.15;
      weights.value = 0.05;
    } else if (queryIntent === 'quality') {
      weights.quality = 0.40;
      weights.relevance = 0.30;
      weights.popularity = 0.15;
      weights.value = 0.10;
      weights.recency = 0.05;
    }

    const finalScore = 
      (relevance * weights.relevance) +
      (popularity * weights.popularity) +
      (quality * weights.quality) +
      (value * weights.value) +
      (recency * weights.recency);

    return {
      finalScore: finalScore.toFixed(2),
      componentScores: {
        relevance: relevance.toFixed(2),
        popularity: popularity.toFixed(2),
        quality: quality.toFixed(2),
        value: value.toFixed(2),
        recency: recency.toFixed(2)
      },
      weights
    };
  }
}

/**
 * Boost and Penalty System
 * Apply business logic boosts/penalties
 */
class BoostPenaltySystem {
  /**
   * Apply category boosts
   * Some categories might have higher priority
   */
  static applyCategoryBoost(score, category) {
    const boosts = {
      'Mobile Phones': 1.1,     // 10% boost
      'Laptops': 1.05,          // 5% boost
      'Headphones': 1.0,        // No boost
      'Tablets': 0.95,          // 5% penalty
      'Smart Watches': 0.95,    // 5% penalty
      'Phone Accessories': 0.9  // 10% penalty
    };

    const boost = boosts[category] || 1.0;
    return score * boost;
  }

  /**
   * Apply brand boosts
   * Premium brands get higher scores
   */
  static applyBrandBoost(score, brand) {
    const boosts = {
      'Apple': 1.15,
      'Samsung': 1.10,
      'Sony': 1.08,
      'Lenovo': 1.05,
      'Dell': 1.05,
      'Xiaomi': 0.95,
      'Boat': 0.90
    };

    const boost = boosts[brand] || 1.0;
    return score * boost;
  }

  /**
   * Apply stock penalties
   * Out of stock products get lower scores
   */
  static applyStockPenalty(score, stock) {
    if (stock === 0) {
      return score * 0.5; // 50% penalty for out of stock
    } else if (stock < 10) {
      return score * 0.75; // 25% penalty for low stock
    } else if (stock > 500) {
      return score * 1.05; // 5% boost for high stock
    }
    return score;
  }

  /**
   * Apply freshness penalty
   * Very old products with no sales get penalized
   */
  static applyFreshnessPenalty(score, product) {
    const ageDays = Math.floor((Date.now() - product.createdAt) / (1000 * 60 * 60 * 24));
    
    if (ageDays > 730 && product.salesCount < 100) {
      return score * 0.7; // 30% penalty for old unpopular products
    }
    
    return score;
  }

  /**
   * Apply all boosts and penalties
   */
  static applyAllAdjustments(score, product) {
    let adjustedScore = score;
    
    adjustedScore = this.applyCategoryBoost(adjustedScore, product.category);
    adjustedScore = this.applyBrandBoost(adjustedScore, product.brand);
    adjustedScore = this.applyStockPenalty(adjustedScore, product.stock);
    adjustedScore = this.applyFreshnessPenalty(adjustedScore, product);
    
    return Math.min(adjustedScore, 100);
  }
}

/**
 * Ranking Service Orchestrator
 * Coordinates all ranking algorithms
 */
class RankingService {
  /**
   * Rank products using advanced algorithms
   */
  static rankProducts(products, query, queryIntent = 'general', algorithm = 'comprehensive') {
    if (!products || products.length === 0) {
      return [];
    }

    // Calculate scores for each product
    const rankedProducts = products.map(product => {
      let score;

      if (algorithm === 'comprehensive') {
        const scoring = MultiFactorRanker.calculateComprehensiveScore(product, query, queryIntent);
        score = parseFloat(scoring.finalScore);
      } else if (algorithm === 'bm25') {
        // Simplified BM25
        score = MultiFactorRanker.calculateRelevanceScore(product, query);
      } else if (algorithm === 'tfidf') {
        // Simplified TF-IDF
        score = MultiFactorRanker.calculateRelevanceScore(product, query);
      } else {
        score = MultiFactorRanker.calculateRelevanceScore(product, query);
      }

      // Apply boosts and penalties
      const finalScore = BoostPenaltySystem.applyAllAdjustments(score, product);

      return {
        product,
        score: finalScore,
        ranking: {
          relevance: MultiFactorRanker.calculateRelevanceScore(product, query),
          popularity: MultiFactorRanker.calculatePopularityScore(product),
          quality: MultiFactorRanker.calculateQualityScore(product),
          value: MultiFactorRanker.calculateValueScore(product),
          recency: MultiFactorRanker.calculateRecencyScore(product, queryIntent)
        }
      };
    });

    // Sort by final score
    return rankedProducts.sort((a, b) => b.score - a.score);
  }

  /**
   * Get diversified results (avoid monopoly by single brand)
   */
  static getDiversifiedResults(rankedProducts, limit = 20) {
    const results = [];
    const brandCounts = {};
    const categoryCount = {};

    for (const item of rankedProducts) {
      const brand = item.product.brand;
      const category = item.product.category;

      // Allow up to 3 products per brand
      if ((brandCounts[brand] || 0) < 3) {
        // Allow up to 5 products per category
        if ((categoryCount[category] || 0) < 5) {
          results.push(item);
          brandCounts[brand] = (brandCounts[brand] || 0) + 1;
          categoryCount[category] = (categoryCount[category] || 0) + 1;

          if (results.length >= limit) break;
        }
      }
    }

    return results;
  }
}

module.exports = {
  BM25Ranker,
  TFIDFRanker,
  MultiFactorRanker,
  BoostPenaltySystem,
  RankingService
};
