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
import VolunteerDashboard from './VolunteerDashboard';
import Volunteernav from '../Components/Volunteernav'; // Make sure this path is correct
import VolunteerPosts from './VolunteerPost';
import VolunteerPostCard from '../Components/VolunteerPostCard';

// import AssignedRequests from './AssignedRequests';      // Ensure this component exists and is correctly named

function Main() {


const location = useLocation();

const donorPaths = ['/donor-dashboard', '/requests', '/make-donations'];
const volunteerPaths = ['/volunteer-dashboard', '/assigned-requests', '/volunteer-post'];

const showDonorNav = donorPaths.includes(location.pathname);
const showVolunteerNav = volunteerPaths.includes(location.pathname);

return (
  <>
    {showDonorNav ? (
      <Donornav />
    ) : showVolunteerNav ? (
      <Volunteernav />
    ) : (
      <NavBar />
    )}

    <Routes>
      {/* Donor Routes */}
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

      {/* Volunteer Routes */}
      <Route
        path="/volunteer-dashboard"
        element={
          <ProtectedRoute allowedUser="Volunteer">
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/volunteer-post"
        element={
          <ProtectedRoute allowedUser="Volunteer">
            <AssignedRequests />
          </ProtectedRoute>
        }
      />
    */}
 
<Route path="/volunteer-post" element={
  <ProtectedRoute allowedUser="Volunteer">
    <VolunteerPosts />
  </ProtectedRoute>
} />

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
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer-post" element={<VolunteerPosts/>} />

      </Routes>
      <Footer/>
    </>
  );
}

export default Main;
