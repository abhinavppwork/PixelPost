import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { api, withAuth } from '../../lib/api';
import { userAuthorContextObj } from "../../contexts/userAuthorContext";
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebaseconfigurations/config";
import { onAuthStateChanged } from "firebase/auth";
import './PostArticle.css';

function PostArticle() {
  const { register, handleSubmit } = useForm();
  const { currentUser } = useContext(userAuthorContextObj);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  async function postArticle(articleObj) {
    if (!firebaseUser) {
      alert("Please login first");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await firebaseUser.getIdToken();

      const authorData = {
        nameOfAuthor: currentUser.firstName,
        email: currentUser.email,
        // Prefer profile image from app context, then fallback to Firebase photoURL
        profileImageUrl: currentUser.profileImageUrl || firebaseUser.photoURL || ""
      };

      articleObj.authorData = authorData;
      articleObj.articleId = Date.now();

      let currentDate = new Date();
      articleObj.dateOfCreation = `${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;
      articleObj.dateOfModification = articleObj.dateOfCreation;
      articleObj.comments = [];
      articleObj.isArticleActive = true;

      let res = await api.post(
        '/author-api/article',
        articleObj,
        withAuth(token)
      );

      if (res.status === 201) {
        navigate(`/author-profile/${currentUser.email}/articles`);
      } else {
        console.log("Error occurred while posting article");
      }
    } catch (err) {
      console.error("Error posting article:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="post-article-container">
      <div className="post-article-card">
        <div className="post-article-header">
          <h1 className="post-article-title">Write Article</h1>
        </div>
        
        <div className="post-article-body">
          <form onSubmit={handleSubmit(postArticle)} className="post-article-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input 
                type="text" 
                className="form-input" 
                id="title" 
                placeholder="Enter your article title..."
                {...register("title", { required: true })} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select 
                {...register("category", { required: true })} 
                id="category" 
                className="form-select" 
                defaultValue=""
              >
                <option value="" disabled>Select category</option>
                <option value="programming">Programming</option>
                <option value="AI&ML">AI & ML</option>
                <option value="database">Database</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea 
                {...register("content", { required: true })} 
                className="form-textarea" 
                id="content" 
                placeholder="Share your thoughts and ideas..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;