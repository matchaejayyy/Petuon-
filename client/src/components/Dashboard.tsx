import { Bell } from "lucide-react";
import SideBar from "./SideBar";
import WhiteContainer from "./WhiteContainer";
import TopContainer from "./TopContainer";
import background from "../assets/BG.png";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen lg:flex-row">
      {/* Top Container */}
      <TopContainer />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row lg:h-full relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${background})` }}
        />

        <div className="flex-1 overflow-y-auto lg:ml-20 bg-white sm:rounded-none lg:rounded-[50px] relative z-10">
          <div className="flex items-center justify-between mt-4 ml-4 md:ml-5 lg:mt-8 lg:mx-8">
            <h1 className="text-4xl font-semibold font-serif tracking-normal">
              Dashboard
            </h1>

            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-blue-500 text-white rounded-full p-3">
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <WhiteContainer>
            <div className="md:flex md:flex-row md:gap-4 lg:gap-5">
              <div className="w-72 h-80 bg-neutral-600 rounded-xl shadow-lg md:w-[342px] md:h-[500px] lg:w-[470px] lg:h-[600px] xl:w-[598px]"></div>
              <div className="md:flex md:flex-col">
                <div className="w-72 h-36 bg-neutral-600 rounded-xl shadow-lg mt-2.5 md:mt-0 md:w-[342px] md:h-[250px] lg:h-[300px] lg:w-[388px] xl:w-[525px]"></div>
                <div className="w-72 h-36 bg-neutral-600 rounded-xl shadow-lg mt-2.5 md:mt-6 md:w-[342px] md:h-[226px] lg:h-[275px] lg:w-[388px] xl:w-[525px]"></div>
              </div>
            </div>
          </WhiteContainer>
        </div>

        {/* Sidebar */}
        <div className="sticky bottom-0 lg:fixed lg:h-full lg:w-20 z-10">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
