import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "./hooks/UseToken"; // Import the useToken hook

interface UserRouteProps {
  children: React.ReactNode; // React children passed to the component
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { token, fetchTokenFromDatabase } = useToken(); // Use the hook

  useEffect(() => {
    console.log("Token in UserRoute:", token);
    const checkAuthentication = async () => {
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuthentication();
  }, [token]); // Ensure it runs when token changes


  // Render a loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If authenticated, render children; otherwise, navigate to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default UserRoute;
