import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Post from './posts';
import AboutUs from './aboutus';
import Contact from './contactus';
import Home from './Home';
import Login from './login';
import Footer from '../Components/footer';
import Register from './Register';
function Main() {
  return (
    <>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </Router>
    </>
  );
}

export default Main;
