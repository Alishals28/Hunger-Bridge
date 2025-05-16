import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />

      <header>
        <video autoPlay muted loop playsInline>
          <source src="/media/vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
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
        <div className="card">
          <img src="https://media.worldnomads.com/explore/bali/pura-batran-water-temple-hero.jpg" alt="Bali" />
          <h2>Exploring Bali</h2>
          <p>Discover tranquil beaches and vibrant culture of Bali.</p>
        </div>
        <div className="card">
          <img src="https://www.tripsavvy.com/thmb/kXiIWEK-jtsgMXXkJl9Wuh1cNiU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Zermatt2-637fa1275dc845f0898f38c771f1f5d7.jpg" alt="Alps" />
          <h2>Swiss Alps Adventure</h2>
          <p>Journey through snow-capped peaks and alpine villages.</p>
        </div>
        <div className="card">
          <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/ac/4d/f1/caption.jpg?w=1200&h=-1&s=1" alt="Sahara" />
          <h2>Sahara Desert Safari</h2>
          <p>Experience golden sands and starry desert nights.</p>
        </div>

        <div className="card hidden">
          <img src="https://www.cometoparis.com/data/layout_image/20784_20770_1.800w_landscape_3-2_xl.jpg?ver=1738235518" alt="Paris" />
          <h2>Paris</h2>
          <p>Stroll along the Seine and savor French cuisine.</p>
        </div>
        <div className="card hidden">
          <img src="https://onetreeplanted.org/cdn/shop/files/Amazon-Rainforests-Amazonia-South-America.jpg?v=1739422746" alt="Amazon" />
          <h2>Amazon Rainforest Expedition</h2>
          <p>Explore lush jungles and diverse wildlife.</p>
        </div>
        <div className="card hidden">
          <img src="https://media.istockphoto.com/id/534804751/photo/kabuki-cho-district-shinjuku-tokyo-japan.jpg?s=612x612&w=0&k=20&c=x2SD2J8GjTpZHnZTP-KwjxkAmUytj1eEha1p8ZTi4xc=" alt="Tokyo" />
          <h2>Tokyo City Lights</h2>
          <p>Experience vibrant nightlife in the heart of Japan.</p>
        </div>
      </section>

      <div className="toggle-button-container" style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button id="toggleButton">Show More</button>
      </div>


// hiiii
      <footer>
        <p>&copy; 2025 Wanderlust Diaries | Travel Blog by Rimsha, Mehreen, Labib</p>
      </footer>

      <script src="/js/script.js"></script>
    </>
  );
};

export default Home;
