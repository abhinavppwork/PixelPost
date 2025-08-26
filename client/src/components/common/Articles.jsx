import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { api, withAuth } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseconfigurations/config"
import { onAuthStateChanged } from "firebase/auth";
import { userAuthorContextObj } from "../../contexts/userAuthorContext";
import "./Articles.css";
import DefaultAvatar from "../../assets/Pixel.png";

function Articles() {
  const { currentUser } = useContext(userAuthorContextObj);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const navigate = useNavigate();

  // ✅ Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch articles only if user is signed in
  async function getArticles() {
    try {
      if (!firebaseUser) return;

      setArticlesLoading(true);
      const token = await firebaseUser.getIdToken(); // ✅ Firebase token
      const res = await api.get("/author-api/articles", withAuth(token));

      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setError("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. Please try again.");
    } finally {
      setArticlesLoading(false);
    }
  }

  useEffect(() => {
    if (firebaseUser) {
      getArticles();
    }
  }, [firebaseUser]);

  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  function gotoCreateArticle() {
    // From /author-profile/:email/articles → ../article
    navigate("../article");
  }

  function getCategoryClass(category) {
    const value = (category || "").toLowerCase();
    if (value === "programming") return "category-programming";
    if (value === "ai&ml" || value === "ai & machine learning") return "category-ai-ml";
    if (value === "database") return "category-database";
    return "category-default";
  }

  function formatCategory(category) {
    if (!category) return "";
    if (category.toLowerCase() === "ai&ml") return "AI&ML";
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  // Show only the date part for "Last updated on" label
  function formatUpdatedDisplay(dateString) {
    if (!dateString || typeof dateString !== "string") return "";
    const [datePart] = dateString.split(" ");
    return datePart || dateString;
  }

  function parseArticleDate(dateString) {
    if (!dateString || typeof dateString !== "string") return null;
    // Expected format from PostArticle: d-m-yyyy hh:mm:ss AM/PM
    const [datePart] = dateString.split(" ");
    const [d, m, y] = datePart.split("-").map((p) => parseInt(p, 10));
    if (!y || !m || !d) {
      const parsed = Date.parse(dateString);
      return Number.isNaN(parsed) ? null : new Date(parsed);
    }
    // Month in Date is 0-indexed
    const safeMonth = Math.max(0, Math.min(11, (m - 1)));
    return new Date(y, safeMonth, d);
  }

  const cutoffDate = useMemo(() => {
    if (selectedDateRange === "30") {
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    if (selectedDateRange === "90") {
      return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    }
    return null;
  }, [selectedDateRange]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      // Search by title/content substring
      const matchesSearch = searchTerm.trim().length === 0
        || (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.content && a.content.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "all"
        || (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());

      // Date filter
      let matchesDate = true;
      if (cutoffDate) {
        const articleDate = parseArticleDate(a.dateOfModification || a.dateOfCreation);
        matchesDate = articleDate ? articleDate >= cutoffDate : false;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [articles, searchTerm, selectedCategory, cutoffDate]);

  const suggestions = useMemo(() => {
    if (searchTerm.trim().length === 0) return [];
    const term = searchTerm.toLowerCase();
    // Suggest by title only, unique first 5
    const titles = articles
      .map((a) => a.title || "")
      .filter((t) => t.toLowerCase().includes(term));
    return Array.from(new Set(titles)).slice(0, 5);
  }, [articles, searchTerm]);

  if (loading) {
    return (
      <div className="articles-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="articles-container">
        <div className="error-message">
          <h2>Authentication Required</h2>
          <p>Please log in to view articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}
      {/* Toolbar: Search + Filters + Add Button */}
      <div className="toolbar">
        <div className="search-section">
          <label htmlFor="articleSearch" className="search-label">Search articles</label>
          <div className="search-wrapper">
            <input
              id="articleSearch"
              type="text"
              className="search-input"
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    className="suggestion-item"
                    onMouseDown={() => { setSearchTerm(s); setShowSuggestions(false); }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="categoryFilter" className="filter-label">Category</label>
            <select
              id="categoryFilter"
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="programming">Programming</option>
              <option value="AI&ML">AI & Machine Learning</option>
              <option value="database">Database</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dateFilter" className="filter-label">Posted</label>
            <select
              id="dateFilter"
              className="filter-select"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="all">All time</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 140 }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: 4, color: "#222" }}>
              Post Article
            </span>
            {(currentUser?.role === "author" || (firebaseUser && currentUser?.role === "author")) && (
              <button
                className="add-article-btn"
                onClick={gotoCreateArticle}
                type="button"
                style={{
                  height: "54.4px",
                  minHeight: "54.4px",
                  maxHeight: "54.4px",
                  display: "flex",
                  alignItems: "center",
                  marginTop: 0,
                  marginBottom: 0,
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                <span className="btn-icon">+</span>
                Add New Article
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {articlesLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="no-articles">
            <h3>No articles found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          filteredArticles.map((articleObj) => (
            <div className="article-card" key={articleObj.articleId}>
              <div className="card-header">
                <div className="author-info">
                  <img
                    src={articleObj.authorData.profileImageUrl || DefaultAvatar}
                    className="author-avatar"
                    alt="Author"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DefaultAvatar; }}
                  />
                  <span className="author-name">
                    {articleObj.authorData.nameOfAuthor}
                  </span>
                </div>
                <span className={`category-badge ${getCategoryClass(articleObj.category)}`}>
                  {formatCategory(articleObj.category)}
                </span>
              </div>
              
              <div className="card-content">
                <h3 className="article-title">{articleObj.title}</h3>
                <p className="article-excerpt">
                  {articleObj.content.substring(0, 120)}...
                </p>
              </div>

              <div className="card-divider"></div>

              <div className="card-footer">
                <span className="update-date">
                  Last updated on {formatUpdatedDisplay(articleObj.dateOfModification)}
                </span>
                <button
                  className="read-more-btn"
                  onClick={() => gotoArticleById(articleObj)}
                >
                  Read more
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Articles;