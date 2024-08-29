import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';

const Contact = () => {
  const form = useRef();
  const [formStatus, setFormStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_y4fqkoh',   // Replace with your EmailJS service ID
        'template_jrwhi9b',  // Replace with your EmailJS template ID
        form.current,
        '0qZy_e98Fvzs8_pCd'    // Replace with your EmailJS public API key
      )
      .then(
        (result) => {
          console.log(result.text);
          setFormStatus('Message sent successfully!');
        },
        (error) => {
          console.log(error.text);
          setFormStatus('Failed to send message. Please try again.');
        }
      );

    e.target.reset();
  };

  return (
    <section className="contact-section" id="contact">
      <h2>Get in Touch</h2>
      <p>I'm always interested in new opportunities and collaborations. Feel free to reach out to me!</p>

      <form ref={form} onSubmit={sendEmail}>
        <label htmlFor="user_email">Your Email:</label>
        <input type="email" id="user_email" name="user_email" required />

        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" name="subject" required />

        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" required></textarea>

        <button type="submit">Send</button>
      </form>

      {formStatus && <p>{formStatus}</p>}
    </section>
  );
};

export default Contact;
