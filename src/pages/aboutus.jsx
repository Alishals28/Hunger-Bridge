import React from 'react';
import './aboutus.css';
import Header from '../Components/Header'
const AboutUs = () => {
    const imms = "https://img.freepik.com/free-photo/close-up-hands-holding-cutlery_23-2149180995.jpg?ga=GA1.1.1369346974.1746966597&semt=ais_hybrid&w=740";
  return (

    <div className="about-container">
      {/* <div className="about-hero">
        <h1>About HungerBridge</h1>
        <p>Connecting hearts. Bridging hunger.</p>
      </div>
    */}
        <Header title="About Hunger Bridge" imageSrc={"/images/posts2.jpg"}/>
      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            At HungerBridge, our mission is to eliminate food waste and fight hunger by
            connecting donors with communities in need. Every meal saved is a life touched.
          </p>
        </section>

        <section>
          <h2>Who We Are</h2>
          <p>
            We are a group of passionate volunteers, developers, and social workers committed to building a
            sustainable bridge between surplus and scarcity. HungerBridge enables anyone to contribute
            to ending hunger with just a few clicks.
          </p>
        </section>

        <section>
          <h2>What We Do</h2>
          <p>
            We use technology to streamline food donation. Our platform allows individuals, restaurants,
            and businesses to donate surplus food directly to nearby NGOs and shelters.
          </p>
        </section>

        <section>
          <h2>Get Involved</h2>
          <p>
            Whether you're a donor, volunteer, or NGO, your role matters. Join our cause today and help
            us nourish the world—one plate at a time.
          </p>
        </section>
      </div>
      </div>
  );
};

export default AboutUs;
