  import React from "react";
  import { Bell, User } from "lucide-react";
  import logo from "../assets/logo.png";

  const TopContainer: React.FC = () => {
    return (
      <div className="flex items-center justify-between h-20 px-4 bg-primary-500 shadow-md md:px-8 lg:hidden">
        <div className="flex items-center ml-[15px] ">
          <Bell className="w-6 h-6 md:w-12 md:h-12 text-gray-600 cursor-pointer" />
        </div>

        <div className="flex justify-center">
          <img src={logo} alt="PetUOn Logo" className="h-[62px] md:h-[100px]" />
        </div>

        <div className=" flex items-center mr-[15px]" >
          <User className="w-6 h-6 md:w-12 md:h-12 text-gray-600 cursor-pointer" />
        </div>
      </div>
    );
  };

  export default TopContainer;
