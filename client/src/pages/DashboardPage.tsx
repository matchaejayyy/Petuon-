import Avatar from "../components/Avatar";
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";
import TopContainer from "../components/TopContainer";

import ToDoListComponent from "../components/ToDoListComponent";

const DashboardPage = () => {
  return (
    <>
      <TopContainer />  
      <WhiteContainer>
        <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] tracking-normal left-0 ml-4 mt-20 md:mt-24 lg:mt-8" >
          Dashboard
        </h1>
        <div className="flex flex-col justify-center items-center gap-8 mt-2.5 md:flex-row md:items-start">

          {/* Stacked ToDo and Progress (Second column) */}
          <div className="flex flex-col gap-2.5 w-72 mb-8 md:mb-10 md:w-[342px] lg:w-[388px] xl:w-[35rem]">
            {/* ToDo List */}
            <div className="w-full h-36 bg-white shadow-xl rounded-[1.5rem] md:h-[250px] lg:h-[21.5rem]">
              <ToDoListComponent variant="compact" />
            </div>
            {/* Progress */}
            <div className="bg-white shadow-xl w-full h-36 rounded-[1.5rem] md:h-[240px] lg:h-[14rem] mt-[1.3rem]">
              Progress
            </div>
          </div>
                    {/* Pets (First column) */}
            <div className="bg-shades-light shadow-xl w-72 h-[328px] rounded-[1.5rem] md:w-[342px] md:h-[500px] lg:w-[470px] lg:h-[589px] xl:w-[45.5rem] xl:h-[37.5rem]">
            Pets
          </div>
        </div>
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default DashboardPage;
