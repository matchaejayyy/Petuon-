import { useState, useEffect } from 'react';
import axios from 'axios';

// Typing for the response and errors
interface TokenResponse {
  token: string | null;
  user_id: string | null;
}

interface LogoutResponse {
  message: string;
}

interface UseTokenReturn {
  token: string | null;
  error: string | null;
  fetchTokenFromDatabase: (user_id: string) => Promise<string | null>;
  logout: (user_id: string) => Promise<void>;
  user_id: string | null;
  setToken: (token: string | null) => void;
}

export const useToken = (): UseTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);

  
  // Fetch the token from the database when the userId changes
  const fetchTokenFromDatabase = async (user_id: string): Promise<string | null> => {
    try {
      const response = await axios.get<TokenResponse>(`http://localhost:3002/token/${user_id}`);
      const { token, user_id: fetchedUserId } = response.data;
  
      if (token && fetchedUserId) {
        console.log(`Fetched token: ${token} for user_id: ${fetchedUserId}`);
        setToken(token);
        setUserId(fetchedUserId);
        return token;
      } else {
        setError("No token or user ID found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      setError("Failed to fetch token.");
      return null;
    }
  };
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    console.log('userId:', user_id); // Log user_id
    console.log('token:', token); // Log token
  }, [user_id, token]);

  const logout = async (user_id: string): Promise<void> => {
    try {
      await axios.post(`http://localhost:3002/token/logout/${user_id}`);
      console.log(`Logged out user_id: ${user_id}`);
      setToken(null);
      localStorage.removeItem("token");
    } catch (error) {
      setError("Logout failed.");
    }
  };
  

    



  return { token, user_id, error, fetchTokenFromDatabase, logout, setToken };
};
