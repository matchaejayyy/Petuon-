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
        <h1 className="text-4xl font-semibold text-[#354F52] tracking-normal left-0 mt-20 md:mt-24 lg:mt-8">
          Dashboard
        </h1>
        <div className="flex flex-col justify-center items-center gap-4 mt-2.5 md:flex-row md:items-start">
          {/* Pets (First column) */}
          <div className="bg-red-100 w-72 h-[328px] rounded-[1.5rem] md:w-[342px] md:h-[500px] lg:w-[470px] lg:h-[589px] xl:w-[45.5rem] xl:h-[37rem]">
            Pets
          </div>

          {/* Stacked ToDo and Progress (Second column) */}
          <div className="flex flex-col gap-2.5 w-72 mb-8 md:mb-10 md:w-[342px] lg:w-[388px] xl:w-[753px]">
            {/* ToDo List */}
            <div className="w-full h-36 bg-red-900 rounded-[1.5rem] md:h-[250px] lg:h-[290px]">
              <ToDoListComponent variant="compact" />
            </div>
            {/* Progress */}
            <div className="bg-red-900 w-full h-36 rounded-[1.5rem] md:h-[240px] lg:h-[280px]">
              Progress
            </div>
          </div>
        </div>
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default DashboardPage;
