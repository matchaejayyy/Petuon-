import React from "react";
import { Link} from "react-router-dom"; 
import logo from "../assets/logo.png"
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react"; 
import background from '../assets/BG.png'

const Sidebar: React.FC = () => {
    return(
        <>
        <div className="flex flex-col bg-[#719191] h-[44.49rem] w-[6rem] fixed left-0 top-0 overflow-hidden rounded-tl-3xl rounded-bl-3xl"   
        style={{ 
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            paddingRight: '0.1rem',
        }}>

                <img src={logo} className="scale-85" alt="Logo"/>

                <div className="flex flex-col space-y-8 fixed top-40 left-1">
                    <Link 
                        to="/"  
                        className="group pl-9 pr-7 pt-3 pb-3 rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">
                            <LayoutDashboard size={28} className=" group-hover:text-[#719191] duration-300 text-white pr-1" />

                    </Link>
                    <Link 
                        to="/Flashcard"
                        className="group pl-9 pr-7 pt-3 pb-3 rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">

                            <WalletCards size={28}  className="group-hover:text-[#719191] duration-300 text-white" />
                    </Link>

                    <Link 
                        to="/Calendar" 
                        className="group pl-9 pr-7 pt-3 pb-3 rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">   

                            <CalendarRange size={28} className="group-hover:text-[#719191] duration-300 text-white"/>
                    </Link>
                    
                    <Link 
                        to="/Notepad"  
                        className="group pl-9 pr-7 pt-3 pb-3 rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">

                            <NotebookPen size={28} className="group-hover:text-[#719191] duration-300 text-white" />
                    </Link>
                    
                    <Link 
                        to="/ToDoList" 
                        className="group pl-9 pr-7 pt-3 pb-3 rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">
                            
                            <ListTodo size={28} className="group-hover:text-[#719191] duration-300 text-white" />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Sidebar