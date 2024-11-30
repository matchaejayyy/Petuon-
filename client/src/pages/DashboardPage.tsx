import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import TopContainer from "../components/TopContainer";
import WhiteContainer from "../components/WhiteContainer";
import { Bell, User, Trophy, Moon, Settings } from "lucide-react";
import { useAuth } from "../context/useAuth"; // Import useAuth for logout functionality

const DashboardPage: React.FC = () => {
  const { logout } = useAuth(); // Access the logout function from useAuth
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative h-screen">
      <TopContainer />
      <WhiteContainer>
        <div className="flex flex-col mt-20 mb-12 md:mt-24 lg:mt-8">
          <div className="flex mb-2.5">
            {/* Title */}
            <h1
              className="text-4xl font-semibold text-center md:text-left"
              style={{ fontFamily: '"Crimson Pro", serif' }}
            >
              Dashboard
            </h1>

            {/* Icons */}
            <div className="hidden lg:flex items-center gap-5 ml-auto">
              {/* Bell Icon */}
              <Bell
                className="text-primary-500 h-12 w-12 cursor-pointer"
                strokeWidth={1.5}
              />
              {/* Profile Icon with Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center rounded-full bg-primary-100 hover:bg-gray-300 h-12 w-12"
                >
                  <User className="text-shades-light h-10 w-10" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 w-56 bg-white shadow-lg rounded-lg border">
                    <div className="p-4 border-b flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-[#354F52]">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">Carmine123</p>
                        <p className="text-sm text-gray-500">
                          carmine@gmail.com
                        </p>
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
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={logout}
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

          <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start gap-5 lg:justify-start lg:items-start">
            <div className="w-72 h-80 bg-neutral-600 rounded-xl shadow-lg md:w-[342px] md:h-[500px] lg:w-[470px] lg:h-[600px] xl:w-[598px]"></div>
            <div className="flex flex-col gap-5 md:w-auto">
              <div className="w-72 h-36 bg-neutral-600 rounded-xl shadow-lg md:w-[342px] md:h-[250px] lg:h-[300px] lg:w-[388px] xl:w-[753px]"></div>
              <div className="w-72 h-36 bg-neutral-600 rounded-xl shadow-lg md:w-[342px] md:h-[226px] lg:h-[275px] lg:w-[388px] xl:w-[753px]"></div>
            </div>
          </div>
        </div>
      </WhiteContainer>
      <Sidebar />
    </div>
  );
};

export default DashboardPage;
