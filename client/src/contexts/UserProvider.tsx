import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import jwt_decode from "jwt-decode";
import { User } from "@supabase/supabase-js";

interface DecodedToken {
  exp: number; // Expiration time of the JWT
  [key: string]: any; // Allows for other dynamic fields in the token
}

type UserContextType = {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const supabase = createClient(
  'https://oizvoxoctozusoahxjos.supabase.co',
  'your-supabase-key-here'
);

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          const decodedToken = jwt_decode<DecodedToken>(savedToken);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < currentTime) {
            console.warn("Token expired, logging out...");
            logout(); // Call logout if token is expired
          } else {
            setToken(savedToken);
          }
        } else {
          setToken(null);
        }
      } catch (error) {
        console.error("Error during session initialization:", error);
      }
    };
  
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setToken(session.access_token);
      } else {
        logout();
      }
    });
  
    initializeSession();
  
    return () => {
      data?.subscription.unsubscribe();
    };
  }, [navigate]);
  

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    navigate("/");
  };

  const isLoggedIn = () => {
    if (token) {
      const decodedToken = jwt_decode<DecodedToken>(token); // Decode token
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp > currentTime; // Token is valid if it's not expired
    }
    return !!user; // Fallback to user presence
  };
  

  return (
    <UserContext.Provider value={{ user, token, logout, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
