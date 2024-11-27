import React from 'react';
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";
import { Bell } from "lucide-react";
import AvatarMenu from "../components/dashboard/AvatarMenu"; // Adjust the import path as needed

const Dashboard: React.FC = () => {
  return (
    <div>
      <WhiteContainer>
        <div>

          <h1
            style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7" > Dashboard

          </h1>
          {/* Top-right section for Bell and Profile */}
          <div className="fixed top-9 right-12 flex items-center space-x-4">
            {/* Bell Icon */}
            <Bell className="text-[#354F52] h-8 w-8 cursor-pointer" />
            {/* Profile Icon with Dropdown */}
            <AvatarMenu />
          </div>
        </div>
      </WhiteContainer>
      <SideBar />
    </div>
  );
};

export default Dashboard;
