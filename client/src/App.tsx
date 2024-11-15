
//the router for the components
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Flashcard from './components/FlashCard';
import ToDoList from './components/ToDoList';
import Notepad from './components/Notepad'

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          {/* Main Routee */}
          <Route path="/" element={<Dashboard />} />
        
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Flashcard" element={<Flashcard />} />
          <Route path="/ToDoList" element={<ToDoList />} />
          <Route path="/Notepad" element={<Notepad />} />
        </Routes>
      </Router>
  );
};

export default App;

