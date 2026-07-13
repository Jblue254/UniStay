import React from 'react'
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
 
  if (!isAuthenticated) {
    // Not logged in at all — send to login first.
    return <Navigate to="/" state={{ from: location }} replace />;
  }
 
  if (!isAdmin) {
    // Logged in, but not an admin — send to the regular homepage.
    return <Navigate to="/" replace />;
  }
 
  return children;
};