import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  WalletCards,
  CalendarRange,
  NotebookPen,
  ListTodo,
  User,
  LogOut,
} from "lucide-react";
import background from "../assets/BG.png";
import logo from "../assets/petuon_logo.png";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className="flex md:flex-row lg:flex-col justify-between items-center lg:justify-start bg-cover bg-no-repeat h-16 lg:h-full lg:w-20 md:h-24 rounded-t-2xl lg:rounded-none px-4 md:px-5 relative z-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Logo Section */}
      <div className="hidden lg:flex items-center justify-center mb-6 lg:pt-6">
        <img src={logo} alt="App Logo" className="w-12 h-12 lg:w-16 lg:h-16" />
      </div>

      {/* Icons with Gap */}
      <div className="flex lg:flex-col gap-4 md:gap-[42px] lg:gap-6">
        <Link
          to="/"
          className={`relative ${
            isActive("/")
              ? "text-[#719191] bg-white p-2 rounded-full"
              : "text-white"
          }`}
        >
          <LayoutDashboard className="w-6 h-6 md:w-12 md:h-12 lg:w-8 lg:h-8" />
        </Link>
        <Link
          to="#"
          className={`relative ${
            isActive("#")
              ? "text-[#719191] bg-white p-2 rounded-full"
              : "text-white"
          }`}
        >
          <User className="w-6 h-6 md:w-12 md:h-12 lg:w-8 lg:h-8" />
        </Link>
        <Link
          to="/Calendar"
          className={`relative ${
            isActive("/Calendar")
              ? "text-[#719191] bg-white p-2 rounded-full"
              : "text-white"
          }`}
        >
          <CalendarRange className="w-6 h-6 md:w-12 md:h-12 lg:w-8 lg:h-8" />
        </Link>
        <Link
          to="/Notepad"
          className={`relative ${
            isActive("/Notepad")
              ? "text-[#719191] bg-white p-2 rounded-full"
              : "text-white"
          }`}
        >
          <NotebookPen className="w-6 h-6 md:w-12 md:h-12 lg:w-8 lg:h-8" />
        </Link>
        <Link
          to="/ToDoList"
          className={`relative ${
            isActive("/ToDoList")
              ? "text-[#719191] bg-white p-2 rounded-full"
              : "text-white"
          }`}
        >
          <ListTodo className="w-6 h-6 md:w-12 md:h-12 lg:w-8 lg:h-8" />
        </Link>
        <Link
          to="/Flashcard"
          className={`relative ${
            isActive("/Flashcard")
              ? "text-[#719191] bg-white p-2 rounded-full"
              : "text-white"
          }`}
        >
          <WalletCards className="w-6 h-6 md:w-12 md:h-12 lg:w-8 lg:h-8" />
        </Link>
      </div>

      <Link to="#" className="text-white lg:mt-auto lg:mb-4 lg:self-center">
        <LogOut className="w-6 h-6 mb-4 md:w-12 md:h-12 lg:w-8 lg:h-8" />
      </Link>
    </div>
  );
};

export default Sidebar;
