import React from 'react';
import { Navigate } from 'react-router-dom';

interface UserRouteProps {
  children: React.ReactNode; // React children passed to the component
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default UserRoute;
