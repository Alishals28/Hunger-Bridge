import React from 'react';
import './Footer.css'; // Import the CSS file
import { FaEnvelope, FaPhone } from 'react-icons/fa'; // Importing icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="green-band">
        <p className="footer-text">&copy; 2025 HungerBridge. All rights reserved.</p>
      </div>
      <div className="footer-content">
        <p className="footer-tagline">Your contributions make a world of difference!</p>
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope size={20} />
            <a href="mailto:support@hungerbridge.org" className="contact-link">support@hungerbridge.org</a>
          </div>
          <div className="contact-item">
            <FaPhone size={20} />
            <a href="tel:+1234567890" className="contact-link">+1 (234) 567-890</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
