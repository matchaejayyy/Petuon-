import { useState, useEffect } from "react";
import { useAuth } from "../contexts/UserProvider"; // Import useAuth for logout functionality
import { Bell, User, Trophy, Moon, Settings } from "lucide-react";
import axios from "axios";

const Avatar = () => {
  const { logout } = useAuth(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const token = localStorage.getItem('token');
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/avatar/getUser",  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data
        setUserName(userData.user_name);
        setUserEmail(userData.user_email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* Top-right section for Bell and Profile */}
      <div className="fixed right-12 top-9 hidden items-center space-x-4 lg:flex">
        {/* Bell Icon */}
        <Bell className="h-8 w-8 cursor-pointer text-[#354F52]" />
        {/* Profile Icon with Dropdown */}
        <div className="relative">
          {/* Profile Icon (clickable) */}
          <button
            onClick={toggleDropdown}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <User className="h-7 w-7 text-[#354F52]" />
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-lg border bg-white shadow-lg">
              {/* Profile Section */}
              <div className="flex items-center border-b p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-[#354F52]">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-3">

                  <p className="font-medium text-gray-800">{userName}</p>

                      <p className="text-sm text-gray-500" title={userEmail}>
                      {userEmail.length > 5 ? `${userEmail.substring(0, 5)}...@gmail.com` : userEmail}
                      </p>

                </div>
              </div>
              {/* Dropdown Options */}
              <ul className="py-2">
                <li className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100">
                  <Trophy className="mr-2 h-5 w-5 text-gray-700" />
                  Achievements
                </li>
                <li className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100">
                  <Settings className="mr-2 h-5 w-5 text-gray-700" />
                  Settings
                </li>
                <li className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100">
                  <Moon className="mr-2 h-5 w-5 text-gray-700" />
                  Darkmode
                </li>
              </ul>
              {/* Footer Options */}
              <ul className="border-t">
                {/* Logout Option */}
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={logout} // Call the logout function here
                >
                  Log out
                </li>
              </ul>
              <ul className="border-t">
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Privacy Policy
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Help and Feedback
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Avatar;
