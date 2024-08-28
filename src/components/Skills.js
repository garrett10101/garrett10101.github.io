import React from 'react';
import { FaCode, FaServer, FaDatabase } from 'react-icons/fa';
import './Skills.css';

const Skills = () => {
  return (
    <section className="skills-section">
      <h2>My Skills</h2>
      <div className="skills-grid">
        <div className="skill-card">
          <FaCode />
          <h3>Frontend Development</h3>
          <p>React, JavaScript, HTML, CSS</p>
        </div>
        <div className="skill-card">
          <FaServer />
          <h3>Backend Development</h3>
          <p>Node.js, Express, Django</p>
        </div>
        <div className="skill-card">
          <FaDatabase />
          <h3>Database Management</h3>
          <p>MySQL, PostgreSQL, MongoDB</p>
        </div>
      </div>
    </section>
  );
};

export default Skills;
