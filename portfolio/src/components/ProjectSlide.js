import React from 'react';
import './Projects.css';

const ProjectSlide = ({ slide }) => {
  return (
    <div className="mySlides fade" style={{ display: 'block' }}>
      {slide.video ? (
        <div className="video-container">
          <iframe
            src={slide.video}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Project ${slide.id}`}
          ></iframe>
        </div>
      ) : (
        <div style={{ width: '100%', height: '400px', backgroundColor: '#ddd' }}>Image Placeholder</div>
      )}
      <div className="text-box">
        <p className="slide-text">{slide.description}</p>
        <a href={slide.projectLink} className="project-button" target="_blank" rel="noopener noreferrer">View Project</a>
        {slide.websiteLink && (
          <a href={slide.websiteLink} className="project-button" target="_blank" rel="noopener noreferrer">View Website</a>
        )}
      </div>
    </div>
  );
};

export default ProjectSlide;
