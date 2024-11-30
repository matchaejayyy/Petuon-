import supabase from '../../src/SupabaseClient';
import axios from 'axios';

const BASE = 'http://localhost:3002';

// export const signUp = async (email: string, password: string) => {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });
//   if (error) {
//     throw error;
//   }
//   return data.user;
// };
export const signUp = async (email: string, password: string, userName: string) => {
  const response = await axios.post(`${BASE}/register`, { email, password, userName });
  return response.data; // Backend should return the created user or confirmation
};

export const signIn = async (userName: string, password: string) => {
  const response = await axios.post(`${BASE}/login`, { userName, password });
  return response.data; // Backend should return a token or session info
};
// export const signIn = async (email: string, password: string) => {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   if (error) {
//     throw error;
//   }
//   return data.session;
// };

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};


