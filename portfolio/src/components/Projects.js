import React, { useState, Suspense, lazy } from 'react';
import './Projects.css';

// Lazy load each project to use Suspense for the placeholder
const LazyProjectSlide = lazy(() => import('./ProjectSlide'));

const Projects = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      description: 'CPU vs CUDA - Computer Architecture project that used OpenMP and CUDA to compare performance between CPU and GPU',
      projectLink: 'https://github.com/jtj60/Computer-Architecture-Project',
    },
    {
      id: 2,
      description: 'BobcatCLAWS - Senior Software Project. Deployed via NodeJS on-campus server, used SSL, reverse proxy, and AngularUI. Used MySQL database and created scripts for data collection and reactive webpage.',
      projectLink: 'https://github.com/garrett10101/BobcatClaws',
      websiteLink: 'http://bobcatclaws.ddns.net',
    },
    {
      id: 3,
      video: 'https://www.youtube.com/embed/jC0zacaX3DE',
      description: 'Outdoor Learning Center Eagle Scout Project - Managed construction of an outdoor learning facility.',
      projectLink: 'https://www.youtube.com/watch?v=jC0zacaX3DE',
    },
    {
      id: 4,
      description: 'Machine Learning Course Project - Forecasting Total Dissolved Solids (TDS) and water temperature using advanced machine learning techniques.',
      projectLink: 'https://github.com/garrett10101/Machine-Learning-Project',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section className="projects-section" id="projects" style={{ color: 'white' }}>
      <h2>My Projects</h2>
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <Suspense fallback={<div style={{ width: '100%', height: '400px', backgroundColor: '#ccc' }}>Loading...</div>} key={slide.id}>
            {index === currentSlide && (
              <LazyProjectSlide slide={slide} />
            )}
          </Suspense>
        ))}
        {/* Navigation buttons */}
        <button className="prev" onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>
        <button className="next" onClick={nextSlide} aria-label="Next Slide">&#10095;</button>
      </div>
    </section>
  );
};

export default Projects;
