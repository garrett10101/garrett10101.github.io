import React from 'react';
import { motion } from 'framer-motion';
import { SiPython, SiJavascript, SiReact, SiNodedotjs, SiMongodb } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const skills = [
    { icon: <SiPython size={50} color="#3776AB" />, name: 'Python' },
    { icon: <SiJavascript size={50} color="#F7DF1E" />, name: 'JavaScript' },
    { icon: <SiReact size={50} color="#61DAFB" />, name: 'React' },
    { icon: <SiNodedotjs size={50} color="#339933" />, name: 'Node.js' },
    { icon: <SiMongodb size={50} color="#47A248" />, name: 'MongoDB' },
  ];

  return (
    <section className="skills-section" id="skills">
      <h2>Technical Skills</h2>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="icon-background"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            {skill.icon}
            <p>{skill.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
