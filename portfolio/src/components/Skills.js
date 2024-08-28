import React from 'react';
import { SiPython, SiJavascript, SiReact, SiNodedotjs, SiMongodb } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  return (
    <section className="skills-section" id="skills" style={{ color: 'white' }}>
      <h2>Technical Skills</h2>
      <div className="skills-container">
        <div className="icon-background">
          <SiPython size={50} color="#3776AB" />
          <p>Python</p>
        </div>
        <div className="icon-background">
          <SiJavascript size={50} color="#F7DF1E" />
          <p>JavaScript</p>
        </div>
        <div className="icon-background">
          <SiReact size={50} color="#61DAFB" />
          <p>React</p>
        </div>
        <div className="icon-background">
          <SiNodedotjs size={50} color="#339933" />
          <p>Node.js</p>
        </div>
        <div className="icon-background">
          <SiMongodb size={50} color="#47A248" />
          <p>MongoDB</p>
        </div>
      </div>
    </section>
  );
};

export default Skills;
