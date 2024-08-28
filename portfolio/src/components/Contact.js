import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS details
    const serviceID = 'your_service_id'; // replace with your service ID
    const templateID = 'your_template_id'; // replace with your template ID
    const userID = 'your_user_id'; // replace with your user ID

    emailjs.send(serviceID, templateID, formData, userID)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSuccessMessage('Thank you for your message. I will get back to you soon!');
        setFormData({ email: '', subject: '', message: '' }); // Reset form fields
      })
      .catch((error) => {
        console.error('FAILED...', error);
        setErrorMessage('Sorry, something went wrong. Please try again later.');
      });
  };

  return (
    <section className="contact-section" id="contact" style={{ color: 'white' }}>
      <h2>Get in Touch</h2>
      <p>I'm always interested in new opportunities and collaborations. Feel free to reach out to me!</p>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form id="contactForm" onSubmit={handleSubmit}>
        <label htmlFor="email">Your Email:</label><br />
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        /><br />
        <label htmlFor="subject">Subject:</label><br />
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
        /><br />
        <label htmlFor="message">Message:</label><br />
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
        ></textarea><br />
        <button type="submit">Send</button>
      </form>
    </section>
  );
};

export default Contact;
