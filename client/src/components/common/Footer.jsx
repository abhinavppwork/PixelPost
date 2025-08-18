import React from 'react'
import './Footer.css'
import pixelLogo from '../../assets/logo.png'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <img src={pixelLogo} alt="PixelPost logo" className="footer-logo" />
          <span className="footer-brand">PixelPost</span>
        </div>

        <div className="footer-center">
          <span className="footer-credit">Built by <strong>Cheruku Abhinav</strong></span>
        </div>

        <nav className="footer-right" aria-label="Footer navigation">
          <a
            href="https://www.linkedin.com/in/abhinav-cheruku-46a224304/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <span className="footer-sep">/</span>
          <a
            href="https://github.com/abhinavppwork"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <span className="footer-sep">/</span>
          <a
            href="https://abhinavcheruku.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer