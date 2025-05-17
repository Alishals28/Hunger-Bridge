import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation ,Navigate} from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Post from './posts';
import AboutUs from './aboutus';
import Contact from './contactus';
import Home from './Home';
import Login from './login';
import Footer from '../Components/footer';
import Register from './Register';
import DonorDashboard from './DonorDashboard';
import MakeDonation from '../Components/MakeDonation';
import ProtectedRoute from '../Components/ProtectedRoute';
import Donornav from '../Components/Donornav';
import Requests from './Request';
function Main() {
  const location = useLocation();
  const donorPaths = ['/donor-dashboard','/requests', '/make-donations'];
  const showDonorNav = donorPaths.includes(location.pathname);

  return (
    
    <>
    
      {showDonorNav ? <Donornav /> : <NavBar />}
      <Routes>
         <Route
    path="/donor-dashboard"
    element={
      <ProtectedRoute allowedUser="Donor">
        <DonorDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/make-donations"
    element={
      <ProtectedRoute allowedUser="Donor">
        <MakeDonation />
      </ProtectedRoute>
    }
  />
  <Route
    path="/requests"
    element={
      <ProtectedRoute allowedUser="Donor">
        <Requests />
      </ProtectedRoute>
    }
  />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/make-donations" element={<MakeDonation />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default Main;
