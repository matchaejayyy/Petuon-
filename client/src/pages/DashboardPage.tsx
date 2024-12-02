
import Avatar from "../components/Avatar";
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";

import ToDoListComponent from "../components/ToDoListComponent";

const DashboardPage = () => {

  return (
    <>
      <WhiteContainer>
          <h1
            className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7" > Dashboard
          </h1>
            <div>
              <div className="fixed left-[10.5rem] w-[35rem] h-[21.5rem] bg-white rounded-[1.5rem] top-[6rem]">
                <ToDoListComponent variant="compact"/>
              </div>
              <div className="fixed bg-white w-[35rem] h-[14rem] top-[29rem] left-[10.5rem] rounded-[1.5rem]">Progress</div>
              <div className="fixed bg-white w-[45.5rem] h-[37rem] left-[47.5rem] rounded-[1.5rem] top-[6rem]">Pets</div>
            </div>
            <Avatar/>
        </WhiteContainer>
      <SideBar />
    </>
  );
}

export default DashboardPage