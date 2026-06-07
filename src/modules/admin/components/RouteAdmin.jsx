import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteAdmin = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');
  
  console.log('=== ROUTE ADMIN DEBUG ===');
  console.log('token:', token ? 'Présent' : 'Absent');
  console.log('userRole:', userRole);
  console.log('userRole === "admin" ?', userRole === 'admin');
  
  if (!token) {
    console.log('❌ Pas de token → /connexion');
    return <Navigate to="/connexion" replace />;
  }
  
  if (userRole !== 'admin') {
    console.log(`❌ userRole = "${userRole}" → /dashboard`);
    return <Navigate to="/dashboard" replace />;    
  }
  
  console.log('✅ Admin autorisé → affichage page admin');
  return children;
};

export default RouteAdmin;