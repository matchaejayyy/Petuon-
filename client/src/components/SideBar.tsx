import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  WalletCards,
  CalendarRange,
  NotebookPen,
  ListTodo,
} from "lucide-react";
import logo from "../assets/petuon_logo.png";
import background from "../assets/BG.png";

const Sidebar: React.FC = () => {
  // Ginakuha ang location (kung diin ka na nga page) gamit ang useLocation para sa highlight sa sidebar
  const location = useLocation();

  // Muni nga function nagacheck kung pareho bala ang current nga path sa ginaklik nga link
  const isActive = (path: string) => {
    return location.pathname === path; // Kung ang path pareho sa current nga page, nagabalik siya sang true
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div
        className="fixed bottom-0 hidden h-screen w-screen flex-col bg-cover bg-center bg-no-repeat lg:flex"
        style={{ backgroundImage: `url(${background})` }}
      >
        <img
          src={logo}
          className="fixed left-[0.1rem] top-[1rem] size-[8rem]"
          alt="Logo"
        />
        <div className="fixed left-4 top-[11rem] flex flex-col items-start space-y-5">
          <Link
            to="/"
            className={`group rounded-bl-3xl rounded-tl-3xl pb-[1.2rem] pl-9 pr-16 pt-[1.2rem] transition-colors duration-300 hover:bg-[#F6F6F6] ${isActive("/") ? "bg-[#F6F6F6]" : ""}`}
          >
            <LayoutDashboard
              size={32}
              className={`duration-300 group-hover:text-[#719191] ${isActive("/") ? "scale-150 text-[#719191]" : "transform text-white transition-transform duration-200 hover:scale-125 active:scale-50"}`}
            />
          </Link>
          <Link
            to="/Flashcard"
            className={`group rounded-bl-3xl rounded-tl-3xl pb-[1.2rem] pl-9 pr-11 pt-[1.2rem] transition-colors duration-300 hover:bg-[#F6F6F6] ${isActive("/Flashcard") ? "bg-[#F6F6F6]" : ""}`}
          >
            <WalletCards
              size={32}
              className={`duration-300 group-hover:text-[#719191] ${isActive("/Flashcard") ? "scale-150 text-[#719191]" : "transform text-white transition-transform duration-200 hover:scale-125 active:scale-50"}`}
            />
          </Link>
          <Link
            to="/Notepad"
            className={`group rounded-bl-3xl rounded-tl-3xl pb-[1.2rem] pl-9 pr-11 pt-[1.2rem] transition-colors duration-300 hover:bg-[#F6F6F6] ${isActive("/Notepad") ? "bg-[#F6F6F6]" : ""}`}
          >
            <NotebookPen
              size={32}
              className={`duration-300 group-hover:text-[#719191] ${isActive("/Notepad") ? "scale-150 text-[#719191]" : "transform text-white transition-transform duration-200 hover:scale-125 active:scale-50"}`}
            />
          </Link>
          <Link
            to="/Calendar"
            className={`group rounded-bl-3xl rounded-tl-3xl pb-[1.2rem] pl-9 pr-11 pt-[1.2rem] transition-colors duration-300 hover:bg-[#F6F6F6] ${isActive("/Calendar") ? "bg-[#F6F6F6]" : ""}`}
          >
            <CalendarRange
              size={32}
              className={`duration-300 group-hover:text-[#719191] ${isActive("/Calendar") ? "scale-150 text-[#719191]" : "transform text-white transition-transform duration-200 hover:scale-125 active:scale-50"}`}
            />
          </Link>
          <Link
            to="/ToDoList"
            className={`group rounded-bl-3xl rounded-tl-3xl pb-[1.2rem] pl-9 pr-11 pt-[1.2rem] transition-colors duration-300 hover:bg-[#F6F6F6] ${isActive("/ToDoList") ? "bg-[#F6F6F6]" : ""}`}
          >
            <ListTodo
              size={32}
              className={`duration-300 group-hover:text-[#719191] ${isActive("/ToDoList") ? "scale-150 text-[#719191]" : "transform text-white transition-transform duration-200 hover:scale-125 active:scale-50"}`}
            />
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 z-10 flex h-20 w-full items-center justify-around rounded-t-3xl bg-[#354F52] py-2 shadow-md md:px-8 lg:hidden"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Link
          to="/"
          className={`flex flex-col items-center text-sm ${isActive("/") ? "text-primary-700" : "text-white"}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isActive("/") ? "bg-white" : ""
            }`}
          >
            <LayoutDashboard
              className="h-8 w-8 md:h-12 md:w-12"
              strokeWidth={1.5}
            />
          </div>
        </Link>
        <Link
          to="/Flashcard"
          className={`flex flex-col items-center text-sm ${isActive("/Flashcard") ? "text-primary-700" : "text-white"}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isActive("/Flashcard") ? "bg-white" : ""
            }`}
          >
            <WalletCards
              className="h-8 w-8 md:h-12 md:w-12"
              strokeWidth={1.5}
            />
          </div>
        </Link>
        <Link
          to="/Notepad"
          className={`flex flex-col items-center text-sm ${isActive("/Notepad") ? "text-primary-700" : "text-white"}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isActive("/Notepad") ? "bg-white" : ""
            }`}
          >
            <NotebookPen
              className="h-8 w-8 md:h-12 md:w-12"
              strokeWidth={1.5}
            />
          </div>
        </Link>
        <Link
          to="/Calendar"
          className={`flex flex-col items-center text-sm ${isActive("/Calendar") ? "text-primary-700" : "text-white"}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isActive("/Calendar") ? "bg-white" : ""
            }`}
          >
            <CalendarRange
              className="h-8 w-8 md:h-12 md:w-12"
              strokeWidth={1.5}
            />
          </div>
        </Link>
        <Link
          to="/ToDoList"
          className={`flex flex-col items-center text-sm ${isActive("/ToDoList") ? "text-primary-700" : "text-white"}`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isActive("/ToDoList") ? "bg-white" : ""
            }`}
          >
            <ListTodo className="h-8 w-8 md:h-12 md:w-12" strokeWidth={1.5} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
