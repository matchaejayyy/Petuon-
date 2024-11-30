import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';  // Removed BrowserRouter import
import Dashboard from '../pages/DashboardPage';
import Calendar from '../pages/CalendarPage';
import Flashcard from '../components/FlashCard';
import ToDoList from '../pages/ToDoListPage';
import Notepad from '../pages/NotepadPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { UserProvider } from '../contexts/useAuth'; // Ensure correct import path

interface RoutersProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Routers: React.FC<RoutersProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <UserProvider setIsLoggedIn={setIsLoggedIn}>
      <Routes>
        {isLoggedIn ? (
          <>
            {/* Authenticated Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Flashcard" element={<Flashcard />} />
            <Route path="/Notepad" element={<Notepad />} />

            {/* Dynamic Route for ToDoList with taskId */}
            <Route path="/ToDoList" element={<ToDoList />} />
          </>
        ) : (
          <>
            {/* Unauthenticated Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Redirect unauthenticated users to Login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </UserProvider>
  );
};

export default Routers;
