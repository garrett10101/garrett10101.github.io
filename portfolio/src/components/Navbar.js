import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header>
      <nav>
        <ul className="navbar">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/about">About Me</Link></li>
          <li><Link to="/skills">Skills</Link></li>
          <li><Link to="/contact">Contact Me</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
