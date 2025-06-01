import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/api';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}; 