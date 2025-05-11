import React, { useState } from 'react';
import './contact.css';
const Contact=() => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `mailto:mehreens826@gmail.com?subject=Message from ${form.name}&body=Email: ${form.email}%0D%0A%0D%0A${form.message}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className='main'>
    <div className='contactbox'>
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contact Us</h2>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
      />
    <button className="btn" type="submit">Send Message</button>
    </form>
    </div>
    </div>
  );
};

export default Contact;