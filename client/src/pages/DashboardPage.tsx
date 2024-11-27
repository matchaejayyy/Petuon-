import React from "react";
import Sidebar from "../components/SideBar";
import TopContainer from "../components/TopContainer";
import WhiteContainer from "../components/WhiteContainer";

const DashboardPage: React.FC = () => {
  return (
    <div className="relative h-screen">
      <TopContainer />
      <WhiteContainer>
        <div className="flex flex-col justify-center items-center mt-20 mb-16 ">
          <h1 className="text-4xl font-semibold mb-2.5" style={{ fontFamily: '"Crimson Pro", serif' }}>Dashboard</h1>
          <div className="w-72 h-80 bg-neutral-600 rounded-xl shadow-lg md:w-[342px] md:h-[500px] lg:w-[470px] lg:h-[600px] xl:w-[598px]"></div>
          <div className="md:flex md:flex-col">
            <div className="w-72 h-36 bg-neutral-600 rounded-xl shadow-lg mt-2.5 md:mt-0 md:w-[342px] md:h-[250px] lg:h-[300px] lg:w-[388px] xl:w-[525px]"></div>
            <div className="w-72 h-36 bg-neutral-600 rounded-xl shadow-lg mt-2.5 md:mt-6 md:w-[342px] md:h-[226px] lg:h-[275px] lg:w-[388px] xl:w-[525px]"></div>
          </div>
        </div>
      </WhiteContainer>
      <Sidebar />
    
    </div>
  );
};

export default DashboardPage;
