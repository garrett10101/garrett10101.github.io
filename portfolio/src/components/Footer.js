import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <p style={{ color: 'white' }}>&copy; 2024 Garrett DiPalma</p>
      <div className="social-media">
        <a href="https://www.linkedin.com/in/garrett-dipalma/" className="social-link" target="_blank" rel="noopener noreferrer"><img src="img/linkedin-icon.png" alt="LinkedIn" /></a>
        <a href="https://github.com/garrett10101" className="social-link" target="_blank" rel="noopener noreferrer"><img src="img/github-icon.png" alt="GitHub" /></a>
        <a href="Garrett_Resume - Edited Resume.pdf" download="Garrett_DiPalma_Resume.pdf" className="resume-download">
          <img src="img/download-icon.png" alt="Download Resume" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
