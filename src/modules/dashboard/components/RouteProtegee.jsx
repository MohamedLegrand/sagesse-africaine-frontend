import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteProtegee = ({ children }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/connexion" replace />;
  }
  
  return children;
};

export default RouteProtegee;