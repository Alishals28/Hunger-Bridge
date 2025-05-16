import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <>
      <nav>
        <div className="logo">
          <img src="/images/logo.png" alt="logo" />
          Wanderlust Diaries
        </div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/destinations">Destinations</a></li>
          <li><a href="/gallery">Gallery</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <header>
        <video autoPlay muted loop playsInline>
          <source src="/media/vid.mp4" type="video/mp4" />
        </video>
        <div className="subheading">Explore. Dream. Discover.</div>
        <section className="tagline">
          <div className="line"></div>
          <h2>Popular travel blog posts & guides</h2>
          <div className="line"></div>
        </section>
        <div className="explore-button">
          <a href="/gallery">Start Exploring</a>
        </div>
      </header>

      <div className="section-header">
        <div className="section-divider"></div>
        <h2>Travel Guides</h2>
        <p>Popular travel blog posts & guides</p>
      </div>

      <section className="content">
        {/* Cards here */}
        {/* ... */}
      </section>

      <div className="toggle-button-container" style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button id="toggleButton">Show More</button>
      </div>

      <footer>
        <p>© 2025 Wanderlust Diaries | Travel Blog by Rimsha, Mehreen, Labib</p>
      </footer>

      {/* Optional: import or handle script.js logic in React */}
    </>
  );
};

export default Home;
