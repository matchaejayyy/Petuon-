import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Flashcard from './components/FlashCard';
import ToDoList from './components/ToDoList';
import Notepad from './components/Notepad';
import LoginPage from './components/LoginPage';
import RegisterPage from './Pages/Register';
import { UserProvider } from './Context/useAuth'; // Ensure correct import path

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check login status from localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  return (
    <Router>
      <UserProvider setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          {isLoggedIn ? (
            // Authenticated Routes
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Calendar" element={<Calendar />} />
              <Route path="/Flashcard" element={<Flashcard />} />
              <Route path="/ToDoList" element={<ToDoList />} />
              <Route path="/Notepad" element={<Notepad />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            // Unauthenticated Routes
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
