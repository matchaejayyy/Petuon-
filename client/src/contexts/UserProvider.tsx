import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { AuthSession, User } from "@supabase/supabase-js";

type UserContextType = {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const supabase = createClient(
  'https://oizvoxoctozusoahxjos.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9penZveG9jdG96dXNvYWh4am9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzI5ODYsImV4cCI6MjA0NjM0ODk4Nn0.C1pb4SPi3Ne0aOMd-amYNPG2w-agTdo5qqRG7hFAj5A'
);

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
    
        if (session) {
          setUser(session.user);
          setToken(session.access_token);
        }
      } catch (error) {
        console.error("Error initializing session:", error); // Log any errors
      }
    };
    
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setToken(session?.access_token || null);
      if (!session) navigate("/");
    });
  
    initializeSession();
  
    return () => {
      data?.subscription.unsubscribe();
    };
  }, [navigate]); // The dependency array ensures the effect runs when the `navigate` function changes

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
