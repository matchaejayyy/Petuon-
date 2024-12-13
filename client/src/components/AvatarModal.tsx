import { useState, useEffect } from "react";
import { Bell, User, Moon, Settings } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogInOut from "./logInOutComponent";
import { toast, ToastContainer } from "react-toastify";
import SettingPageModal from "./avatar/SettingsModal";
import {useToken} from "../hooks/UseToken"
import jwtDecode from 'jwt-decode';

const Avatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useToken();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  let userId: string | null = null;

  // Decode the token to get the userId
  useEffect(() => {
    const decodeToken = () => {
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const expiry = decodedToken.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();

          if (currentTime > expiry) {
            setError("Token has expired"); // Set an error if the token is expired
            return;
          }

          userId = decodedToken.user_id; // Decode user_id from the token
        } catch (error) {
          setError("Invalid token");
        }
      } else {
        setError("Token is missing");
      }
    };

    decodeToken();
  }, [token]); // Only run when the token changes or on mount


  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get("http://localhost:3002/avatar/getUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      console.log("User data retrieved:", userData);
      setUserName(userData.user_name);
      setUserEmail(userData.user_email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching user data:", error.response?.data);
      } else {
        console.error("Unexpected error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    if (!error) {
      fetchUserData(); // Only fetch user data if no token-related error
    }
  }, [token, error]); // Fetch user data when token or error changes

  const handleLogout = async () => {
    setLoading(true); // Start loading animation
    try {
      if (userId) {
        // Call the logout function from the useToken hook
        await logout(userId); // Pass the userId to the logout function
      }
      // Remove the token from localStorage
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  if (error) {
    return <div>Error: {error}</div>; // Display the error if there's an issue with the token
  }

  return (
    <>
      <ToastContainer
        position="top-center" // This makes the toast appear at the top center
        autoClose={3000} // Adjust the auto-close time if needed
        hideProgressBar={false} // Show the progress bar
        newestOnTop={true} // New toasts appear at the top of the stack
        closeOnClick // Close on click
        rtl={false} // Set to true for right-to-left layout
        pauseOnFocusLoss
        draggable
      />
      {loading && <LogInOut />}

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
          {openSettings && (
            <>
              <SettingPageModal
                onClose={() => setOpenSettings(false)}
                fetchUserData={fetchUserData}
              />
            </>
          )}
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
                  <p
                    className="cursor-pointer text-sm text-gray-500"
                    title={userEmail}
                  >
                    {userEmail.length > 5
                      ? `${userEmail.substring(0, 5)}...@gmail.com`
                      : userEmail}
                  </p>
                </div>
              </div>
              {/* Dropdown Options */}
              <ul className="py-2">
                <li
                  className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenSettings(true)}
                >
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
                  onClick={handleLogout}
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
