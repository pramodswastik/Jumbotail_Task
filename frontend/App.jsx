import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Main App Component
 * E-commerce Search Engine Frontend
 */
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    limit: 20,
    sortBy: "relevance",
    order: "desc",
    diversify: false,
  });
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [activeTab, setActiveTab] = useState("search");

  const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";

  // Fetch catalog statistics
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "stats") {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await fetch(`${API_BASE}/search/stats`);
      const data = await response.json();

      if (!response.ok) {
        setStatsError(data.message || "Failed to load catalog stats");
        setStats(null);
        return;
      }

      if (data.success) {
        setStats(data.stats);
      } else {
        setStatsError(data.message || "Catalog stats unavailable");
        setStats(null);
      }
    } catch (err) {
      setStatsError("Failed to fetch stats: " + err.message);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: filters.limit,
        sortBy: filters.sortBy,
        order: filters.order,
        diversify: filters.diversify,
        algorithm: "comprehensive",
      });

      const response = await fetch(`${API_BASE}/search/product?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Search failed");
        return;
      }

      if (data.success) {
        setResults(data.data);
        if (data.totalResults === 0) {
          setError("No products found matching your search");
        }
      }
    } catch (err) {
      setError("Error performing search: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🛍️ E-Commerce Search Engine</h1>
          <p>Advanced search with intelligent ranking for electronics</p>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
        >
          Search Products
        </button>
        <button
          className={`tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Catalog Stats
        </button>
      </nav>

      {activeTab === "search" && (
        <main className="main-content">
          <section className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products... (e.g., 'sasta iPhone', 'latest laptop')"
                  className="search-input"
                  autoFocus
                />
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              <div className="filters">
                <div className="filter-group">
                  <label>Results per page:</label>
                  <select
                    value={filters.limit}
                    onChange={(e) =>
                      setFilters({ ...filters, limit: e.target.value })
                    }
                    className="filter-select"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort by:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="filter-select"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="sales">Popularity</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Order:</label>
                  <select
                    value={filters.order}
                    onChange={(e) =>
                      setFilters({ ...filters, order: e.target.value })
                    }
                    className="filter-select"
                  >
                    <option value="desc">High to Low</option>
                    <option value="asc">Low to High</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.diversify}
                      onChange={(e) =>
                        setFilters({ ...filters, diversify: e.target.checked })
                      }
                    />
                    Diversify Results
                  </label>
                </div>
              </div>
            </form>

            {error && <div className="error-message">⚠️ {error}</div>}
          </section>

          {results.length > 0 && (
            <section className="results-section">
              <h2>Search Results ({results.length})</h2>

              <div className="results-grid">
                {results.map((product) => (
                  <div key={product.productId} className="product-card">
                    <div className="product-header">
                      <h3>{product.title}</h3>
                      <span className="badge">{product.brand}</span>
                    </div>

                    <p className="description">
                      {product.description.substring(0, 100)}...
                    </p>

                    <div className="product-stats">
                      <div className="stat">
                        <span className="label">Rating:</span>
                        <span className="value">⭐ {product.rating}/5</span>
                      </div>
                      <div className="stat">
                        <span className="label">Stock:</span>
                        <span className="value">
                          {product.stock > 0
                            ? "✅ " + product.stock
                            : "❌ Out of Stock"}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="label">Category:</span>
                        <span className="value">{product.category}</span>
                      </div>
                    </div>

                    <div className="pricing">
                      <div className="price-display">
                        <span className="current-price">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="original-price">
                          ₹{product.mrp.toLocaleString("en-IN")}
                        </span>
                        <span className="discount">
                          {product.discountPercentage}% off
                        </span>
                      </div>
                    </div>

                    <div className="ranking-scores">
                      <h4>Ranking Breakdown</h4>
                      <div className="score-bars">
                        <ScoreBar
                          label="Relevance"
                          score={product.ranking.relevance}
                        />
                        <ScoreBar
                          label="Quality"
                          score={product.ranking.quality}
                        />
                        <ScoreBar
                          label="Popularity"
                          score={product.ranking.popularity}
                        />
                        <ScoreBar label="Value" score={product.ranking.value} />
                        <ScoreBar
                          label="Recency"
                          score={product.ranking.recency}
                        />
                      </div>
                      <div className="final-score">
                        Final Score: <strong>{product.score}/100</strong>
                      </div>
                    </div>

                    <div className="metadata">
                      <h4>Specifications</h4>
                      <ul>
                        {Object.entries(product.metadata)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {activeTab === "stats" && (
        <main className="main-content">
          <section className="stats-section">
            <h2>Catalog Statistics</h2>

            {statsLoading && (
              <div className="error-message">Loading stats...</div>
            )}

            {statsError && <div className="error-message">⚠️ {statsError}</div>}

            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.totalProducts ?? "-"}</h3>
                  <p>Total Products</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalCategories ?? "-"}</h3>
                  <p>Categories</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalBrands ?? "-"}</h3>
                  <p>Brands</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.avgRating ?? "-"}/5</h3>
                  <p>Average Rating</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.inStockProducts ?? "-"}</h3>
                  <p>In Stock Items</p>
                </div>
                <div className="stat-card">
                  <h3>
                    ₹
                    {typeof stats.totalValue === "number"
                      ? (stats.totalValue / 10000000).toFixed(1)
                      : "-"}
                    Cr
                  </h3>
                  <p>Total Inventory Value</p>
                </div>
              </div>
            )}

            {stats && (
              <div className="details">
                <h3>Categories</h3>
                <ul className="category-list">
                  {stats.categories?.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>

                <h3>Top Brands</h3>
                <ul className="brand-list">
                  {stats.brands?.slice(0, 10).map((brand) => (
                    <li key={brand}>{brand}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </main>
      )}

      <footer className="footer">
        <p>E-Commerce Search Engine • Powered by Node.js + React</p>
      </footer>
    </div>
  );
}

/**
 * Score Bar Component
 */
function ScoreBar({ label, score }) {
  return (
    <div className="score-bar">
      <span className="score-label">{label}</span>
      <div className="bar-background">
        <div className="bar-fill" style={{ width: `${score}%` }}></div>
      </div>
      <span className="score-value">{score}</span>
    </div>
  );
}

export default App;
