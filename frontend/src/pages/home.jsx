import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <header>
        <video autoPlay muted loop playsInline>
          <source src="/videos/vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="subheading">Every Plate Counts</div>
        <section className="tagline">
          <div className="line"></div>
          <p>Every untouched meal has a second chance — and someone out there who needs it. We make the connection happen.</p>

          <div className="line"></div>
        </section>
        <div className="explore-button">
          <a href="/gallery">Start Donating</a>
        </div>
      </header>

      <div className="section-header">
        <div className="section-divider"></div>
        <h2>How It Works?</h2>
        <p>Popular travel blog posts & guides</p>
      </div>

      <section className="content">
        <div className="card">
          <img src="https://brownliving.in/cdn/shop/articles/food-donation-services-988981.jpg?v=1703200384" alt="Bali" />
          <h1>Donate</h1>
          <p>Restaurants, individuals, or businesses share surplus food.</p>
        </div>
        <div className="card">
          <img src="https://img.freepik.com/free-photo/people-stacking-hands-together-park_53876-63293.jpg?semt=ais_hybrid&w=740" alt="Alps" />
          <h1>Connect</h1>
          <p>We match donors with nearby NGOs or volunteers.</p>
        </div>
        <div className="card">
          <img src="https://media.istockphoto.com/id/1287632111/photo/weve-got-you-covered-during-lockdown.jpg?s=612x612&w=0&k=20&c=7tP1pfzLUEWHnDv-Sb8Gc_4NepfpUV5aG_Z4P_3DJ80=" alt="Sahara" />
          <h1>Deliver</h1>
          <p>Food gets safely delivered to those in need.</p>
        </div>

      </section>




    {/*   <footer>
        <p>&copy; 2025 Wanderlust Diaries | Travel Blog by Rimsha, Mehreen, Labib</p>
      </footer>
*/}
      <script src="/js/script.js"></script>
    </>
  );
};

export default Home;
