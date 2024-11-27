import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react";
import logo from "../assets/petuon_logo.png";
import background from '../assets/BG.png';

const Sidebar: React.FC = () => {
    // Ginakuha ang location (kung diin ka na nga page) gamit ang useLocation para sa highlight sa sidebar
    const location = useLocation(); 

    // Muni nga function nagacheck kung pareho bala ang current nga path sa ginaklik nga link
    const isActive = (path: string) => {
        return location.pathname === path;  // Kung ang path pareho sa current nga page, nagabalik siya sang true
    };

    return (
        <div 
            className="flex flex-col h-screen w-screen bg-cover bg-center bg-no-repeat fixed bg-sm"   
            style={{ backgroundImage: `url(${background})` }}>
            
            {/* Logo */}
            <img src={logo} className="fixed left-[0.1rem] top-[1rem] size-[8rem]" alt="Logo" />

            {/* Sidebar Links */}
            <div className="flex flex-col items-start space-y-5 fixed top-40 left-4">
                <Link 
                    to="/"  
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/") ? "bg-[#F6F6F6]" : ""}`}>
                    <LayoutDashboard size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/") ? "text-[#719191]" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
                </Link>

                <Link 
                    to="/Flashcard"
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Flashcard") ? "bg-[#F6F6F6]" : ""}`}>
                    <WalletCards size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Flashcard") ? "text-[#719191]" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
                </Link>

                <Link 
                    to="/Calendar" 
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Calendar") ? "bg-[#F6F6F6]" : ""}`}>
                    <CalendarRange size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Calendar") ? "text-[#719191]" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
                </Link>
                
                <Link 
                    to="/Notepad"  
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Notepad") ? "bg-[#F6F6F6]" : ""}`}>
                    <NotebookPen size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Notepad") ? "text-[#719191]" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
                </Link>
                
                <Link 
                    to="/ToDoList" 
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/ToDoList") ? "bg-[#F6F6F6]" : ""}`}>
                    <ListTodo size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/ToDoList") ? "text-[#719191]" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;