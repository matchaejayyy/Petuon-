import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react";
import logo from "../assets/logo.png";
import background from '../assets/BG.png';

const Sidebar: React.FC = () => {
    // Get the current location to highlight the active link
    const location = useLocation(); 

    // Check if the current path matches the provided path
    const isActive = (path: string) => {
        return location.pathname === path;
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
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300 ${isActive("/") ? "bg-white" : ""}`}>
                    <LayoutDashboard size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/") ? "text-[#719191]" : "text-white"}`} />
                </Link>

                <Link 
                    to="/Flashcard"
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300 ${isActive("/Flashcard") ? "bg-white" : ""}`}>
                    <WalletCards size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Flashcard") ? "text-[#719191]" : "text-white"}`} />
                </Link>

                <Link 
                    to="/Calendar" 
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300 ${isActive("/Calendar") ? "bg-white" : ""}`}>
                    <CalendarRange size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Calendar") ? "text-[#719191]" : "text-white"}`} />
                </Link>
                
                <Link 
                    to="/Notepad"  
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300 ${isActive("/Notepad") ? "bg-white" : ""}`}>
                    <NotebookPen size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Notepad") ? "text-[#719191]" : "text-white"}`} />
                </Link>
                
                <Link 
                    to="/ToDoList" 
                    className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300 ${isActive("/ToDoList") ? "bg-white" : ""}`}>
                    <ListTodo size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/ToDoList") ? "text-[#719191]" : "text-white"}`} />
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
