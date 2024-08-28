import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Skills from './components/Skills';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: 'black' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
