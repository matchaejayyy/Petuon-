import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import Calendar from "./pages/CalendarPage";
import Flashcard from "./pages/FlashCardPage";
import ToDoList from "./pages/ToDoListPage";
import Notepad from "./pages/NotepadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserProvider, useAuth } from "./contexts/UserProvider";

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <UserProvider>
      <Routes>
        {isLoggedIn() ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Flashcard" element={<Flashcard />} />
            <Route path="/ToDoList" element={<ToDoList />} />
            <Route path="/Notepad" element={<Notepad />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </UserProvider>
  );
};

export default App;