
import Avatar from "../components/Avatar";
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";



const DashboardPage = () => {

  return (
    <div>
      <WhiteContainer>
        <div>
          <h1
             style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7" > Dashboard
          </h1>
          <Avatar/>
        </div>    
      </WhiteContainer>
      <SideBar />
      
    </div>
  );
}

export default DashboardPage