import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// Typing for the response and errors
interface DecodedToken {
  exp: number;
}

interface TokenResponse {
  token: string | null;
}

interface LogoutResponse {
  message: string;
}

interface UseTokenReturn {
  token: string | null;
  error: string | null;
  fetchTokenFromDatabase: (user_id: string) => Promise<string | null>;
  logout: (user_id: string) => Promise<void>;
}

export const useToken = (): UseTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenFromDatabase = async (user_id: string): Promise<string | null> => {
    try {
      console.log("Fetching token for userId:", user_id);
      const response = await axios.get<TokenResponse>(`http://localhost:3002/token/${user_id}`);

      if (response.data.token) {
        console.log("Token found:", response.data.token);
        setToken(response.data.token); // This triggers re-render with updated token
        return response.data.token;
      } else {
        console.error("No token found for userId:", user_id);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error while fetching token:", error.response?.data);
      } else {
        console.error("Unexpected error while fetching token:", error);
      }
      return null;
    }
  };

  const logout = async (user_id: string): Promise<void> => {
    try {
      console.log("Logging out user with userId:", user_id);
      const response = await axios.post<LogoutResponse>(`http://localhost:3002/token/logout/${user_id}`);

      if (response.data.message) {
        console.log(response.data.message);
        // Handle successful logout (e.g., clear token from state)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error while logging out:", error.response?.data);
      } else {
        console.error("Unexpected error while logging out:", error);
      }
    }
  };

  return { token, error, fetchTokenFromDatabase, logout };
};
