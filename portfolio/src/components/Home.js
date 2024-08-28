import React from 'react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  return (
    <section className="home-section">
      <motion.div
        className="intro"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2>Welcome to My Portfolio</h2>
        <p>I am Garrett DiPalma, a passionate software developer.</p>
      </motion.div>
    </section>
  );
};

export default Home;
