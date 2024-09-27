import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <h2>About Me</h2>
      <h3>Education</h3>
      <p><strong>Bachelor of Science in Computer Science</strong> <br />
        Texas State University<br />
        San Marcos, TX <br />
        Relevant Coursework: Machine Learning, Computer Systems Fundamentals, Data Mining, Database Systems, Data Structures & Algorithms, Object-Oriented Programming, Software Engineering.
      </p>
      <h3>Relevant Experience/Projects</h3>
      <ul>
        <li><strong>IT Technician - QASystems, AISD Contractor</strong> (<i>03/2024 - Present</i>) - Provided Tier 1 hardware support focusing on Chromebook repair. Conducted QC checks, inventory sorting, and other assigned projects. Used inventory management software for record-keeping.</li>
        <li><strong>IT Assistant - Meadows Center, Texas State University</strong> (<i>02/2023 - Present</i>) - Installed, set up, and configured WeeWX on an Intel NUC and a Davis Vantage Pro 2 station. Managed Apache and FTP for device backup, improving data accuracy and reporting efficiency.</li>
        <li><strong>Computer Technician - GTS Technologies</strong> (<i>06/2023 - 09/2023</i>) - Conducted Quality Assurance on Chromebooks, iPads, and other devices. Led the update of Inventory Management Software and Database Management System, ensuring smooth network operations.</li>
      </ul>
      <section id="skills">
        <h2>Technical Skills</h2>
        <div className="skills-container">
          {/* Languages and Technologies Icons */}
          {/* List each technology or skill as shown in your original HTML */}
        </div>
      </section>
      <h3>Honors & Distinctions</h3>
      <p><strong>National Eagle Scout (2015)</strong> - Demonstrated exceptional leadership, organizational, and problem-solving skills through the completion of a community service project.</p>
    </section>
  );
};

export default About;
