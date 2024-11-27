import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

<<<<<<< HEAD
import Dashboard from '../Pages/DashboardPage';
import Calendar from '../Pages/CalendarPage';
import Flashcard from '../components/FlashCard';
import ToDoList from '../Pages/ToDoListPage';
import Notepad from '../Pages/NotepadPage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import { UserProvider } from '../Context/useAuth'; // Ensure correct import path
=======
import Dashboard from '../pages/DashboardPage';
import Calendar from '../pages/CalendarPage';
import Flashcard from '../components/FlashCard';
import ToDoList from '../pages/ToDoListPage';
import Notepad from '../pages/NotepadPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
>>>>>>> d9d36e824c00fb71f9a58d04cb5278512b2da035

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
            <Route path="/ToDoList" element={<ToDoList />} />
            <Route path="/Notepad" element={<Notepad />} />
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
