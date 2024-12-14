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
  clearToken: () => void;
  userId: string | null;
}

export const useToken = (): UseTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);

  // Fetch the token from the database when the userId changes
  const fetchTokenFromDatabase = async (user_id: string): Promise<string | null> => {
    try {
      const response = await axios.get<TokenResponse>(`http://localhost:3002/token/${user_id}`);
      console.log("Response from token fetch:", response.data);
      const { token, user_id: fetchedUserId } = response.data;
  
      if (token) {
        setToken(token);
        setUserId(fetchedUserId); // Set the userId from the response
        return token;
      } else {
        setError("No token found for user.");
        return null;
      }
    } catch (error) {
      setError("Failed to fetch token.");
      return null;
    }
  };
  

  const logout = async (user_id: string): Promise<void> => {
    try {
      const response = await axios.post<LogoutResponse>(`http://localhost:3002/token/logout/${user_id}`);
      setToken(null);
      setUserId(null); // Clear userId on logout
    } catch (error) {
      setError("Logout failed.");
    }
  };

  const clearToken = () => {
    setToken(null);
    setUserId(null); // Clear userId as well
  };

  return { token, userId, error, fetchTokenFromDatabase, logout, clearToken };
};
