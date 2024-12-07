/* eslint-disable @typescript-eslint/no-explicit-any */
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
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          setToken(session.access_token);
        } else {
          const savedToken = localStorage.getItem("token");
          if (savedToken) {
            // Decode token to check expiry
            const decodedToken = jwt_decode<DecodedToken>(savedToken); // Typecast as DecodedToken
            const currentTime = Math.floor(Date.now() / 1000);

            // If token is expired, log out user
            if (decodedToken.exp < currentTime) {
              localStorage.removeItem("token");
              setToken(null);
            } else {
              setToken(savedToken);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing session:", error);
      }
    };

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setToken(session?.access_token || null);
      if (!session) navigate("/login");
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

  const isLoggedIn = () => !!user;

  return (
    <UserContext.Provider value={{ user, token, logout, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);