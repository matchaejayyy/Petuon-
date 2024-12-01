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
  "process.env.REACT_APP_SUPABASE_ANON_KEY!"
);

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const initializeSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (session) {
        setUser(session.user);
        setToken(session.access_token);
      }
    };
  
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setToken(session?.access_token || null);
      if (!session) navigate("/");
    });
  
    initializeSession();
  
    // Correctly handle the subscription cleanup
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
  
}
export const useAuth = () => React.useContext(UserContext);
