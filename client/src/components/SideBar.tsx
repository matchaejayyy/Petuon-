import React from "react";
import { Link} from "react-router-dom"; 
import logo from "../assets/logo.png"
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react"; 
import background from '../assets/BG.png'

const Sidebar: React.FC = () => {
    return(
        <>
        <div className="flex flex-col h-screen w-screen bg-cover bg-center bg-no-repeat fixed bg-sm"   
        style={{ 
            backgroundImage: `url(${background})`,
        }}>

                <img src={logo} className="fixed left-[0.2rem] top-[1rem] size-[6rem]" alt="Logo"/>

                <div className="flex flex-col space-y-8 fixed top-40 left-1">
                    <Link 
                        to="/"  
                        className="fixed left-[0.15rem] group pl-9 pr-7 pt-[1rem] pb-[1rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">
                            <LayoutDashboard size={33} className=" group-hover:text-[#719191] duration-300 text-white pr-1" />

                    </Link>
                    <Link 
                        to="/Flashcard"
                        className="fixed left-0 top-[13rem] group pl-9 pr-7 pt-[1rem] pb-[1rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">

                            <WalletCards size={32}  className="group-hover:text-[#719191] duration-300 text-white" />
                    </Link>

                    <Link 
                        to="/Calendar" 
                        className="fixed left-0 top-[18rem] group pl-9 pr-7 pt-[1rem] pb-[1rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">   

                            <CalendarRange size={32} className="group-hover:text-[#719191] duration-300 text-white"/>
                    </Link>
                    
                    <Link 
                        to="/Notepad"  
                        className="fixed left-0 top-[23rem] group pl-9 pr-7 pt-[1rem] pb-[1rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">

                            <NotebookPen size={32} className="group-hover:text-[#719191] duration-300 text-white" />
                    </Link>
                    
                    <Link 
                        to="/ToDoList" 
                        className="fixed left-0 top-[28rem]  group pl-9 pr-7 pt-[1rem] pb-[1rem] rounded-tl-3xl rounded-bl-3xl hover:bg-white transition-colors duration-300">
                            
                            <ListTodo size={32} className="group-hover:text-[#719191] duration-300 text-white" />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Sidebar