import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteAdmin = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  if (!token) return <Navigate to="/connexion" replace />;
  if (userRole !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default RouteAdmin;
