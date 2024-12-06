import Avatar from "../components/Avatar";
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";
import Pets from "../components/dashboard/Pets";

import ToDoListComponent from "../components/ToDoListComponent";

const DashboardPage = () => {
  return (
    <>
      <WhiteContainer>
        <h1
          style={{ fontFamily: '"Crimson Pro", serif' }}
          className="ftracking-normal mb-4 mt-7 text-[3rem] text-[#354F52]"
        >
          {" "}
          Dashboard
        </h1>
        <div>
          <div className="fixed left-[9.8rem] top-[6rem] h-[21.5rem] w-[35rem] rounded-[1.5rem] bg-white shadow-lg">
            <ToDoListComponent variant="compact" />
          </div>
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="fixed left-[9.8rem] top-[29rem] h-[14rem] w-[35rem] rounded-[1.5rem] bg-white p-3 text-xl font-bold text-[#354F52] shadow-lg"
          >
            Progress
          </div>
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="fixed left-[47.5rem] top-[6rem] h-[37rem] w-[45.5rem] rounded-[1.5rem] bg-white text-xl font-bold text-[#354F52] shadow-lg"
          >
            <Pets />
          </div>
        </div>
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default DashboardPage;
