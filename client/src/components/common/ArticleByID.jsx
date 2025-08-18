import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/userAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { api, withAuth } from "../../lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseconfigurations/config";
import DefaultAvatar from "../../assets/Pixel.png";
import "./ArticleByID.css";

function ArticleByID() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(userAuthorContextObj);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [articleData, setArticleData] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ If user not signed in, redirect to login or show message
  if (!firebaseUser) {
    return (
      <div className="article-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view or edit this article.</p>
        </div>
      </div>
    );
  }

  // ✅ Save article changes
  async function onSave(modifiedArticle) {
    try {
      setLoading(true);
      const articleAfterChanges = { ...articleData, ...modifiedArticle };
      const token = await firebaseUser.getIdToken();
      const currentDate = new Date();

      articleAfterChanges.dateOfModification =
        currentDate.getDate() +
        "-" +
        (currentDate.getMonth() + 1) +
        "-" +
        currentDate.getFullYear();

      const res = await api.put(
        `/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        withAuth(token)
      );

      if (res.data.message === "article updated") {
        setEditArticleStatus(false);
        setArticleData(res.data.payload);
      } else {
        console.log("Unexpected response:", res.data);
      }
    } catch (err) {
      console.error(
        "Error occurred while saving article:",
        err.response?.data || err.message || err
      );
    } finally {
      setLoading(false);
    }
  }

  function enableEdit() {
    setEditArticleStatus(true);
  }

  function cancelEdit() {
    setEditArticleStatus(false);
    reset();
  }

  // ✅ Delete article
  async function deleteArticle() {
    try {
      setLoading(true);
      const updatedArticle = { ...articleData, isArticleActive: false };
      const token = await firebaseUser.getIdToken();

      const res = await api.put(
        `/author-api/articles/${updatedArticle.articleId}`,
        updatedArticle,
        withAuth(token)
      );

      if (res.data.message === "article deleted or restored") {
        setArticleData(res.data.payload);
      }
    } catch (err) {
      console.error("Error deleting article:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Restore article
  async function restoreArticle() {
    try {
      setLoading(true);
      const updatedArticle = { ...articleData, isArticleActive: true };
      const token = await firebaseUser.getIdToken();

      const res = await api.put(
        `/author-api/articles/${updatedArticle.articleId}`,
        updatedArticle,
        withAuth(token)
      );

      if (res.data.message === "article deleted or restored") {
        setArticleData(res.data.payload);
      }
    } catch (err) {
      console.error("Error restoring article:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Add comment
  async function addComment(commentObj) {
    try {
      setLoading(true);
      commentObj.nameOfUser = currentUser.firstName || firebaseUser.displayName;
      const token = await firebaseUser.getIdToken();

      const res = await api.put(
        `/user-api/comment/${articleData.articleId}`,
        commentObj,
        withAuth(token)
      );

      if (res.data.message === "comment added") {
        setCommentStatus("Comment added successfully");
        setArticleData(res.data.payload);
        reset();
        setTimeout(() => setCommentStatus(""), 3000);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentStatus("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="article-container">
      {/* Navigation */}
      <div className="navigation-section">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("../articles")}
        >
          <span className="back-arrow">←</span>
          Back to Articles
        </button>
      </div>

      {editArticleStatus === false ? (
        <div className="article-view">
          {/* Article Header */}
          <div className="article-header">
            <div className="article-meta">
              <span
                className={`category-badge ${
                  articleData?.category
                    ? articleData.category.toLowerCase() === "programming"
                      ? "category-programming"
                      : articleData.category.toLowerCase() === "ai&ml"
                      ? "category-ai-ml"
                      : articleData.category.toLowerCase() === "database"
                      ? "category-database"
                      : "category-default"
                    : "category-default"
                }`}
              >
                {articleData?.category?.toLowerCase() === "ai&ml"
                  ? "AI&ML"
                  : (articleData?.category || "").charAt(0).toUpperCase() + (articleData?.category || "").slice(1)}
              </span>
              <h1 className="article-title">{articleData.title}</h1>
              <div className="article-dates">
                <span className="date-item">
                  <strong>Created:</strong> {articleData.dateOfCreation}
                </span>
                <span className="date-item">
                  <strong>Modified:</strong> {articleData.dateOfModification}
                </span>
              </div>
              {!articleData.isArticleActive && (
                <div className="status-badge deleted">
                  Article Deleted
                </div>
              )}
            </div>

            <div className="author-actions">
              <div className="author-info">
                <img
                  src={articleData.authorData.profileImageUrl || DefaultAvatar}
                  className="author-avatar"
                  alt="Author"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DefaultAvatar; }}
                />
                <div className="author-details">
                  <span className="author-name">{articleData.authorData.nameOfAuthor}</span>
                  <span className="author-label">Author</span>
                </div>
              </div>

              {currentUser.role === "author" && (
                <div className="action-buttons">
                  <button 
                    className="action-btn edit-btn" 
                    onClick={enableEdit}
                    disabled={loading}
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  {articleData.isArticleActive ? (
                    <button 
                      className="action-btn delete-btn" 
                      onClick={deleteArticle}
                      disabled={loading}
                    >
                      <MdDelete />
                      <span>Delete</span>
                    </button>
                  ) : (
                    <button 
                      className="action-btn restore-btn" 
                      onClick={restoreArticle}
                      disabled={loading}
                    >
                      <MdRestore />
                      <span>Restore</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="article-content">
            <div className="content-wrapper">
              <p className="content-text">{articleData.content}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3 className="section-title">
              Comments ({articleData.comments.length})
            </h3>
            
            {articleData.comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="comments-list">
                {articleData.comments.map((commentObj, index) => (
                  <div key={commentObj._id || index} className="comment-item">
                    <div className="comment-header">
                      <span className="commenter-name">{commentObj?.nameOfUser}</span>
                    </div>
                    <p className="comment-text">{commentObj?.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          {currentUser.role === "user" && (
            <div className="add-comment-section">
              <h4 className="section-title">Add Your Comment</h4>
              {commentStatus && (
                <div className={`status-message ${commentStatus.includes('Failed') ? 'error' : 'success'}`}>
                  {commentStatus}
                </div>
              )}
              <form onSubmit={handleSubmit(addComment)} className="comment-form">
                <div className="form-group">
                  <textarea
                    {...register("comment", { required: true })}
                    className="comment-input"
                    placeholder="Share your thoughts about this article..."
                    rows="4"
                  />
                </div>
                <button 
                  type="submit" 
                  className="submit-comment-btn"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Comment"}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="article-edit">
          <div className="edit-header">
            <h2>Edit Article</h2>
            <p>Make changes to your article content</p>
          </div>

          <form onSubmit={handleSubmit(onSave)} className="edit-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Article Title
              </label>
              <input
                type="text"
                className="form-input"
                id="title"
                defaultValue={articleData.title}
                {...register("title", { required: true })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                {...register("category", { required: true })}
                id="category"
                className="form-select"
                defaultValue={articleData.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI & Machine Learning</option>
                <option value="database">Database</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Article Content
              </label>
              <textarea
                {...register("content", { required: true })}
                className="form-textarea"
                id="content"
                rows="12"
                defaultValue={articleData.content}
                placeholder="Write your article content here..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={cancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleByID;