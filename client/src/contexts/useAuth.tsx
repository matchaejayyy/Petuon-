import React, { createContext, useEffect, useState, ReactNode, FC } from "react";
import { UserProfile, UserProfileToken } from "../model/User"; // Ensure correct import path
import { useNavigate } from "react-router-dom";
import { signUp, signIn, signOut } from "../services/AuthService";
import { toast } from "react-toastify";
import supabase from '../../src/SupabaseClient';

interface UserContextType {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  isLoggedIn: () => boolean;
  logout: () => void;
}

interface Props {
  children: ReactNode;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: FC<Props> = ({ children, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (session) {
        setUser({
          userName: session.user.email || '', // Using email as userName
          email: session.user.email || '',
        });
        setToken(session.access_token);
      }
    };

    fetchSession();
  }, []);

  const registerUser = async (email: string, password: string) => {
    try {
      const user = await signUp(email, password);
      if (user) {
        setUser({
          userName: user.email || '', // Using email as userName
          email: user.email || '',
        });
        toast.success("Registration Success!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.warning("Server error occurred");
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const session = await signIn(email, password);
      if (session) {
        setUser({
          userName: session.user.email || '', // Using email as userName
          email: session.user.email || '',
        });
        setToken(session.access_token);
        setIsLoggedIn(true);
        navigate("/dashboard");
        toast.success("Login Success!");
      }
    } catch (error) {
      toast.warning("Server error occurred");
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      navigate("/login");
      toast.info("Logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        isLoggedIn,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
