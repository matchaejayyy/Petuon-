import React from "react";
import { Bell, User, Trophy, Moon, Settings} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/useAuth"; // Import useAuth for logout functionality
import logo from "../assets/petuon_logo.png"

const TopContainer: React.FC = () => {
  const { logout } = useAuth(); // Access the logout function from useAuth
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
    return (
    <div className="bg-primary-500 w-screen h-16 z-10 top-0 fixed px-4">
    {/* Top-right section for Bell and Profile */}
    <div className="flex items-center justify-between h-full">
      {/* Bell Icon */}
      <Bell className="text-[#354F52] h-8 w-8 cursor-pointer" />
      <img src={logo} alt="Logo" className=" h-16 w-16 mx-auto" />
      {/* Profile Icon with Dropdown */}
      <div className="relative">
        {/* Profile Icon (clickable) */}
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <User className="text-[#354F52] h-8 w-8" />
        </button>
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-56 bg-white shadow-lg rounded-lg border">
            {/* Profile Section */}
            <div className="p-4 border-b flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-[#354F52]">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">Carmine123</p>
                <p className="text-sm text-gray-500">carmine@gmail.com</p>
              </div>
            </div>
            {/* Dropdown Options */}
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
            {/* Footer Options */}
            <ul className="border-t">
              {/* Logout Option */}
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={logout} // Call the logout function here
              >
                Log out
              </li>
            </ul>
            <ul className="border-t">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Privacy Policy
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Help and Feedback
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default TopContainer;