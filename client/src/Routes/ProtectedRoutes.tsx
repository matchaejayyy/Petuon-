import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/UserProvider'; // Make sure you import the useAuth hook

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation(); // To keep track of where the user was trying to go
  const { isLoggedIn } = useAuth(); // Get the login status from context

  // If the user is not logged in, redirect them to the login page
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the children (protected components)
  return <>{children}</>;
};

export default ProtectedRoute;
