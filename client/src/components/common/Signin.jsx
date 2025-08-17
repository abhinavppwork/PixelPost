import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebaseconfigurations/config";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

export default function Signin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function signIn() {
        if (isLoading) return;
       
        try {
            setIsLoading(true);
            setError("");
            await signInWithPopup(auth, googleProvider);
            navigate("/");
        } catch (err) {
            setError("Failed to sign in. Please try again.");
            console.error("Sign-in error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="signin-page">
            {/* Animated Background Elements */}
            <div className="bg-pattern">
                <div className="floating-square"></div>
                <div className="floating-square"></div>
                <div className="floating-square"></div>
                <div className="floating-square"></div>
                <div className="floating-square"></div>
                <div className="floating-square"></div>
            </div>
            
            {/* Grid Pattern Overlay */}
            <div className="grid-overlay"></div>
           
            <div className="signin-container">
                {/* Logo/Brand Section */}
            
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "2rem"
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "stretch",
                                border: "2px solid #000",
                                borderRadius: "8px",
                                overflow: "hidden",
                                width: "220px",
                                height: "52px",
                                background: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}>
                                <div style={{
                                    background: "#000",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "1.4rem",
                                    letterSpacing: "0.15em",
                                    padding: "0 1.2em",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "inherit",
                                    minWidth: "50%"
                                }}>
                                    PIXEL
                                </div>
                                <div style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.4rem",
                                    letterSpacing: "0.1em",
                                    padding: "0 1.2em",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "inherit",
                                    minWidth: "50%"
                                }}>
                                    POST
                                </div>
                            </div>
                        </div>
        

                {/* Main Content */}
                <div className="signin-content">
                    <div className="signin-header">
                        <h2 className="signin-title">Welcome Back</h2>
                        <p className="signin-subtitle">
                            Access your account and continue your journey
                        </p>
                    </div>
                   
                    {error && (
                        <div className="error-message">
                            <div className="error-icon">!</div>
                            <span>{error}</span>
                        </div>
                    )}
                   
                    <div className="signin-form">
                        <button
                            onClick={signIn}
                            className={`google-signin-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            <div className="btn-content">
                                <div className="google-icon">
                                    <svg viewBox="0 0 24 24" className="google-logo">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                </div>
                                <span className="btn-text">Continue with Google</span>
                                <div className="btn-arrow">→</div>
                            </div>
                            {isLoading && (
                                <div className="loading-spinner">
                                    <div className="spinner-ring"></div>
                                </div>
                            )}
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="signin-footer">
                <p>Don't have an account? <button onClick={() => navigate("/signup")} className="link-btn">Sign up</button></p>
                </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>
        </div>
    );
}