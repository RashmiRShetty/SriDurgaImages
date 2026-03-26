import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const sessionExpiry = localStorage.getItem('adminSessionExpiry');
  
  // Check if session is still valid (not expired)
  const isSessionValid = sessionExpiry && parseInt(sessionExpiry) > Date.now();

  if (!isAuthenticated || !isSessionValid) {
    // If not authenticated or session expired, redirect to login
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminSessionExpiry');
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
