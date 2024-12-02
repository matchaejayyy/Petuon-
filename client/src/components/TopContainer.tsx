import React from "react";
import { Bell, User, Trophy, Moon, Settings} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth"; // Import useAuth for logout functionality
import logo from "../assets/petuon_logo.png";

const TopContainer: React.FC = () => {
  const { logout } = useAuth(); // Access the logout function from useAuth
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-primary-500 w-screen h-16 z-10 top-0 fixed px-4 md:px-8 md:h-20 lg:hidden">
      <div className="flex items-center justify-between h-full">
        {/* Bell Icon */}
        <Bell className="text-shades-light h-8 w-8 md:h-12 md:w-12 cursor-pointer" strokeWidth={1.5} />
        <img src={logo} alt="Logo" className="h-16 w-16 mx-auto md:h-24 md:w-24" />
        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 hover:bg-gray-300 md:h-12 md:w-12"
          >
            <User className="text-shades-light h-8 w-8 md:h-10 md:w-10" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-56 bg-white shadow-lg rounded-lg border">
              <div className="p-4 border-b flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-[#354F52]">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Carmine123</p>
                  <p className="text-sm text-gray-500">carmine@gmail.com</p>
                </div>
              </div>
              <ul className="py-2">
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Trophy className="h-5 w-5 mr-2 text-gray-700" />
                  Achievements
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Settings className="h-5 w-5 mr-2 text-gray-700" />
                  Settings
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Moon className="h-5 w-5 mr-2 text-gray-700" />
                  Darkmode
                </li>
              </ul>
              <ul className="border-t">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>
                  Log out
                </li>
              </ul>
              <ul className="border-t">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Privacy Policy</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help and Feedback</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopContainer;
