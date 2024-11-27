import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react";
import logo from "../assets/petuon_logo.png";
import background from '../assets/BG.png';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <div 
        className="hidden lg:flex flex-col h-screen w-screen bg-cover bg-center bg-no-repeat bottom-0 z-10 fixed px-4"
        style={{ backgroundImage: `url(${background})` }}>
        <img src={logo} className="fixed left-[0.1rem] top-[1rem] size-[8rem]" alt="Logo" />
        <div className="flex flex-col items-start space-y-5 fixed bottom-0 left-4 mb-5">
          <Link
            to="/"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/") ? "bg-[#F6F6F6]" : ""}`}>
            <LayoutDashboard size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/") ? "text-[#719191]" : "text-white"}`} />
          </Link>
          <Link
            to="/Flashcard"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Flashcard") ? "bg-[#F6F6F6]" : ""}`}>
            <WalletCards size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Flashcard") ? "text-[#719191]" : "text-white"}`} />
          </Link>
          <Link
            to="/Calendar"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Calendar") ? "bg-[#F6F6F6]" : ""}`}>
            <CalendarRange size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Calendar") ? "text-[#719191]" : "text-white"}`} />
          </Link>
          <Link
            to="/Notepad"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Notepad") ? "bg-[#F6F6F6]" : ""}`}>
            <NotebookPen size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Notepad") ? "text-[#719191]" : "text-white"}`} />
          </Link>
          <Link
            to="/ToDoList"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/ToDoList") ? "bg-[#F6F6F6]" : ""}`}>
            <ListTodo size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/ToDoList") ? "text-[#719191]" : "text-white"}`} />
          </Link>
        </div>
      </div>

      <div
        className="lg:hidden fixed bottom-0 left-0 w-full bg-[#354F52] flex justify-around items-center py-2 shadow-md rounded-t-3xl h-24 z-10"
        style={{ backgroundImage: `url(${background})` }}>
        <Link
          to="/"
          className={`flex flex-col items-center text-sm ${isActive("/") ? "text-[#F6F6F6]" : "text-white"}`}>
          <LayoutDashboard size={32} />
        </Link>
        <Link
          to="/Flashcard"
          className={`flex flex-col items-center text-sm ${isActive("/Flashcard") ? "text-[#F6F6F6]" : "text-white"}`}>
          <WalletCards size={32} />
        </Link>
        <Link
          to="/Calendar"
          className={`flex flex-col items-center text-sm ${isActive("/Calendar") ? "text-[#F6F6F6]" : "text-white"}`}>
          <CalendarRange size={32} />
        </Link>
        <Link
          to="/Notepad"
          className={`flex flex-col items-center text-sm ${isActive("/Notepad") ? "text-[#F6F6F6]" : "text-white"}`}>
          <NotebookPen size={32} />
        </Link>
        <Link
          to="/ToDoList"
          className={`flex flex-col items-center text-sm ${isActive("/ToDoList") ? "text-[#F6F6F6]" : "text-white"}`}>
          <ListTodo size={32} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
