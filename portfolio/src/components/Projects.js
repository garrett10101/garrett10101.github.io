import React, { useState } from 'react';
import './Projects.css';

const Projects = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      // image: 'img/CPU vs CUDA.png', // Commented out real image
      image: 'https://via.placeholder.com/800x400?text=CPU+vs+CUDA', // Placeholder image
      description: 'CPU vs CUDA - Computer Architecture project that used OpenMP and CUDA to compare performance between CPU and GPU',
      projectLink: 'https://github.com/jtj60/Computer-Architecture-Project',
    },
    {
      id: 2,
      // image: 'img/BobcatClaws.png', // Commented out real image
      image: 'https://via.placeholder.com/800x400?text=BobcatCLAWS', // Placeholder image
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
      // image: 'img/Predictions Graph_GB_GridSearch.png', // Commented out real image
      image: 'https://via.placeholder.com/800x400?text=Machine+Learning+Project', // Placeholder image
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
          <div
            key={slide.id}
            className={`mySlides fade ${index === currentSlide ? 'active' : ''}`}
            style={{ display: index === currentSlide ? 'block' : 'none' }}
          >
            {slide.image && <img src={slide.image} style={{ width: '100%' }} alt={slide.description} />}
            {slide.video && (
              <div className="video-container">
                <iframe
                  src={slide.video}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Project ${slide.id}`}
                ></iframe>
              </div>
            )}
            <div className="text-box">
              <p className="slide-text">{slide.description}</p>
              <a href={slide.projectLink} className="project-button" target="_blank" rel="noopener noreferrer">View Project</a>
              {slide.websiteLink && (
                <a href={slide.websiteLink} className="project-button" target="_blank" rel="noopener noreferrer">View Website</a>
              )}
            </div>
          </div>
        ))}
        {/* Navigation buttons */}
        <button className="prev" onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>
        <button className="next" onClick={nextSlide} aria-label="Next Slide">&#10095;</button>
      </div>
    </section>
  );
};

export default Projects;
