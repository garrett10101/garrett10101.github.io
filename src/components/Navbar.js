import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleDarkMode }) => {
  return (
    <nav className="navbar">
      <h1>My Portfolio</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/skills">Skills</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><button onClick={toggleDarkMode} className="dark-mode-toggle">Toggle Dark Mode</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
