import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../../contexts/userAuthorContext';
import { auth } from "../../firebaseconfigurations/config"
import { onAuthStateChanged, signOut } from 'firebase/auth';
import PixelLogo from '../../assets/logo.png';
import './Header.css';

function Header() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setCurrentUser((prev) => ({
          ...prev,
          firstName: user.displayName ? user.displayName.split(" ")[0] : "",
          lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
          email: user.email,
          profileImageUrl: user.photoURL || "",
        }));
      } else {
        setFirebaseUser(null);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [setCurrentUser]);

  // Sign out handler
  async function handleSignout() {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="header">
      <nav className="header-nav">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/" className="logo-link" title="Home">
            <img 
              src={PixelLogo} 
              alt="Pixel Logo" 
              className="logo-image"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <ul className="nav-items">
          {!firebaseUser ? (
            <div className="auth-buttons">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signin" className="nav-link login-btn">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link signup-btn">
                  Sign Up
                </Link>
              </li>
            </div>
          ) : (
            <div className="user-section">
              {/* User Profile Dropdown */}
              <div className="user-dropdown">
                <button
                  className={`user-button ${showDropdown ? 'active' : ''}`}
                  onClick={toggleDropdown}
                >
                  <div className="profile-image-container">
                    <img
                      src={currentUser?.profileImageUrl || firebaseUser?.photoURL || "/default-avatar.png"}
                      className="profile-image"
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                    <span className="online-indicator"></span>
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {firebaseUser.displayName || currentUser?.firstName || "User"}
                    </span>
                    <span className="user-email">
                      {firebaseUser.email}
                    </span>
                  </div>
                  <svg 
                    className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`}
                    width="16" 
                    height="16" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">
                        {firebaseUser.displayName || "User"}
                      </div>
                      <div className="dropdown-user-email">
                        {firebaseUser.email}
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg width="16" height="16" fill="currentColor" className="dropdown-icon">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                      </svg>
                      Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg width="16" height="16" fill="currentColor" className="dropdown-icon">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.292-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.292c.415.764-.42 1.6-1.185 1.184l-.292-.159a1.873 1.873 0 0 0-2.692 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.693-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.292A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                      </svg>
                      Settings
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleSignout}
                    >
                      <svg width="16" height="16" fill="currentColor" className="dropdown-icon">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              {/* Always-visible Sign Out button */}
              <button
                className="logout-inline-btn"
                onClick={handleSignout}
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;