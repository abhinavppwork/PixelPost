import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api, withAuth } from "../../lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseconfigurations/config";
import { userAuthorContextObj } from "../../contexts/userAuthorContext";
import Spline from '@splinetool/react-spline';
import "./Home.css"; // Import the external CSS

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [error, setError] = useState("");
  const wordsRef = useRef([]);

  // ✅ Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setCurrentUser({
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email,
          profileImageUrl: user.photoURL || "",
          role: currentUser?.role || null
        });
      } else {
        setFirebaseUser(null);
        setCurrentUser({});
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize animations when component mounts
  useEffect(() => {
    // Simple CSS animation for floating words (kept for potential future use)
    const animateWords = () => {
      wordsRef.current.forEach((word, index) => {
        if (word) {
          word.style.animationDelay = `${index * 0.5}s`;
        }
      });
    };

    animateWords();
  }, []);

  function signin() {
    navigate("/signin");
  }

  // ✅ Handle role selection
  async function onSelectRole(e) {
    setError("");
    const selectedRole = e.target.value;
    const updatedUser = { ...currentUser, role: selectedRole };

    try {
      if (!firebaseUser) {
        setError("Please log in first.");
        return;
      }

      const token = await firebaseUser.getIdToken();

      let res = null;
      // Do not send uid to backend to avoid strict schema errors
      const apiPayload = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl,
        role: selectedRole,
      };
      if (selectedRole === "author") {
        res = await api.post(
          "/author-api/author",
          apiPayload,
          withAuth(token)
        );
      } else {
        res = await api.post(
          "/user-api/user",
          apiPayload,
          withAuth(token)
        );
      }

      const { message, payload } = res.data;
      if (message === selectedRole) {
        // Preserve uid locally; merge server payload
        setCurrentUser({ ...currentUser, role: selectedRole, ...payload });
      } else {
        setError(message || "Failed to set role");
      }
    } catch (err) {
      console.error("Axios error:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  // ✅ Navigate based on role
  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0 && currentUser?.email) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0 && currentUser?.email) {
      navigate(`/author-profile/${currentUser.email}/articles`);
    }
  }, [currentUser?.role, error]);

  return (
    <div className="home-container">
      {!firebaseUser && (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">Where Words Come to Life</h1>
              <p className="hero-subtitle">Discover stories that inspire, inform, and ignite conversation</p>
              <p className="hero-description">
                Join our community of writers and readers exploring the depths of human experience through the power of words. Every story matters, every voice counts.
              </p>
              <button className="cta-button" onClick={signin}>
                <i className="bi bi-box-arrow-in-right"></i>
                Sign In to Continue
              </button>
            </div>

            <div className="book-animation">
              <Spline scene="https://prod.spline.design/WWGoyjtt14kztaW7/scene.splinecode" />
            </div>
          </section>

          <section className="features">
            <h2 className="section-title">Why Choose PixelPost?</h2>
            <p className="section-subtitle">
              Experience a platform designed for meaningful connections through storytelling
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-number">01</div>
                <h3 className="feature-title">Thoughtful Writing</h3>
                <p className="feature-description">
                  Carefully crafted articles that spark meaningful conversations and deep reflection on life's most important topics.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-number">02</div>
                <h3 className="feature-title">Diverse Perspectives</h3>
                <p className="feature-description">
                  Voices from around the world sharing unique stories and insights that broaden your understanding of the human experience.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-number">03</div>
                <h3 className="feature-title">Community Focus</h3>
                <p className="feature-description">
                  A space where readers and writers connect and grow together, fostering genuine relationships through shared stories.
                </p>
              </div>
            </div>
          </section>

          <section className="platform-features">
            <h2 className="section-title">Simple, intuitive tools to write, share, and inspire.</h2>
            <p className="section-subtitle">
              Everything you need to create compelling content and build meaningful connections
            </p>
            
            <div className="platform-features-grid">
              <div className="platform-feature-card">
                <div className="platform-feature-icon">
                  <i className="bi bi-palette-fill"></i>
                </div>
                <h3 className="platform-feature-title">Modern Interface</h3>
                <p className="platform-feature-description">
                  Clean, minimalist design with intuitive navigation and carefully chosen color schemes for optimal readability.
                </p>
              </div>

              <div className="platform-feature-card">
                <div className="platform-feature-icon">
                  <i className="bi bi-phone-fill"></i>
                </div>
                <h3 className="platform-feature-title">Responsive Design</h3>
                <p className="platform-feature-description">
                  Fluid layouts that adapt seamlessly to any screen size, ensuring a consistent experience across all devices.
                </p>
              </div>

              <div className="platform-feature-card">
                <div className="platform-feature-icon">
                  <i className="bi bi-lightning-fill"></i>
                </div>
                <h3 className="platform-feature-title">Interactive Elements</h3>
                <p className="platform-feature-description">
                  Smooth animations and engaging user interactions that enhance the browsing experience and content engagement.
                </p>
              </div>
            </div>
          </section>

          <section className="technology-stack">
            <h2 className="section-title">Built with modern technology</h2>
            <p className="section-subtitle">
              Leveraging cutting-edge tools to deliver a seamless blogging experience
            </p>
            
            <div className="tech-stack-grid">
              <div className="tech-item">
                <div className="tech-icon react-icon">
                  <i className="bi bi-braces-asterisk"></i>
                </div>
                <span className="tech-name">React</span>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon mongodb-icon">
                  <i className="bi bi-database-fill"></i>
                </div>
                <span className="tech-name">MongoDB</span>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon nodejs-icon">
                  <i className="bi bi-code-slash"></i>
                </div>
                <span className="tech-name">Node.js</span>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon express-icon">
                  <i className="bi bi-server"></i>
                </div>
                <span className="tech-name">Express</span>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon firebase-icon">
                  <i className="bi bi-fire"></i>
                </div>
                <span className="tech-name">Firebase</span>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon github-icon">
                  <i className="bi bi-github"></i>
                </div>
                <span className="tech-name">GitHub</span>
              </div>
            </div>
          </section>
        </>
      )}

      {firebaseUser && (
        <div className="auth-section">
          <div className="signin-card">
            <div className="profile-section">
              {firebaseUser?.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt="Profile"
                  className="profile-image"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              ) : (
                <i className="bi bi-person-circle profile-icon"></i>
              )}
              
              <h2 className="user-name">
                {firebaseUser.displayName || "Welcome"}
              </h2>
              <p className="user-email">
                <i className="bi bi-envelope-fill me-2"></i>
                {firebaseUser.email}
              </p>
            </div>

            <div className="role-selection">
              <h3 className="role-title">Select Your Role</h3>
              
              {error && (
                <div className="error-alert">
                  {error}
                </div>
              )}

              <div className="role-options">
                <div className="role-option">
                  <input 
                    type="radio" 
                    id="author" 
                    name="role" 
                    value="author" 
                    className="role-input" 
                    onChange={onSelectRole}
                  />
                  <label htmlFor="author" className="role-label" aria-label="Choose Author role">
                    <div className="icon-circle">
                      <i className="bi bi-pencil-square role-icon"></i>
                    </div>
                    <span className="role-text">Author</span>
                  </label>
                </div>

                <div className="role-option">
                  <input 
                    type="radio" 
                    id="user" 
                    name="role" 
                    value="user" 
                    className="role-input" 
                    onChange={onSelectRole}
                  />
                  <label htmlFor="user" className="role-label" aria-label="Choose Reader role">
                    <div className="icon-circle">
                      <i className="bi bi-journal-text role-icon"></i>
                    </div>
                    <span className="role-text">Reader</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;