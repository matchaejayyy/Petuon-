import ToDoListComponent from "../components/ToDoListComponent";
import WhiteContainer from "../components/WhiteContainer"
import Sidebar from "../components/SideBar";
import Avatar from "../components/Avatar";
import Clock from "../components/Clock";





const ToDoListPage = () => {
  return (
    <>
      <WhiteContainer>
        <h1
          style={{ fontFamily: '"Crimson Pro", serif' }}
          className="ftracking-normal mb-4 ml-1 mt-7 text-[3rem] text-[#354F52]"
        >
          To Do List
        </h1>
        <Clock />
        <ToDoListComponent />
        <Avatar />
      </WhiteContainer>
      <Sidebar />
    </>
  );
};

export default ToDoListPage;
