import React from 'react';
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';
import './Footer.css';
import resumeFile from '/assets/Garrett_Resume - Edited Resume.pdf';
const Footer = () => {
  return (
    <footer>
      <p style={{ color: 'white' }}>&copy; 2024 Garrett DiPalma</p>
      <div className="social-media">
        <a href="https://www.linkedin.com/in/garrett-dipalma/" className="social-link" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={30} color="#0e76a8" />
        </a>
        <a href="https://github.com/garrett10101" className="social-link" target="_blank" rel="noopener noreferrer">
          <FaGithub size={30} color="#333" />
        </a>
        <a href={resumeFile} download="Garrett_DiPalma_Resume.pdf" className="resume-download">
          <FaDownload size={30} color="#00cc66" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
