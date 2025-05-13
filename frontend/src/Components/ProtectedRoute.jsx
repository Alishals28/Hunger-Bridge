import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUser }) => {
  const token = localStorage.getItem('access');
  const userType = localStorage.getItem('user_type');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedUser && userType !== allowedUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
