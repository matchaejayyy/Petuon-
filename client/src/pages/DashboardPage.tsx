
import Avatar from "../components/Avatar";
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";



const DashboardPage = () => {

  return (
    <>
      <WhiteContainer>
          <h1
             style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7" > Dashboard
          </h1>
          <Avatar/>
            <div>
              <div className="fixed left-[10.5rem] w-[35rem] h-[21.5rem] bg-white rounded-[1.5rem] top-[6rem]">
                <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
                <ul className="space-y-6">
                    <li className="flex justify-between">
                        <span>HOMEWORK 1</span><span className="text-gray-500 text-sm">Today</span>
                    </li>
                    <li className="flex justify-between">
                        <span>HOMEWORK 2</span><span className="text-gray-500 text-sm">Today</span>
                    </li>
                    <li className="flex justify-between">
                        <span>HOMEWORK 3</span><span className="text-gray-500 text-sm">Today</span>
                    </li>
                    <li className="flex justify-between">
                        <span>HOMEWORK 4</span><span className="text-gray-500 text-sm">Tomorrow</span>
                    </li>
                    <li className="flex justify-between">
                        <span>HOMEWORK 5</span><span className="text-gray-500 text-sm">Tomorrow</span>
                    </li>
                </ul>
                <button className="mt-4 w-[35rem] bg-teal-600 text-white py-2 rounded hover:bg-teal-700">View all</button>
              </div>
              <div className="fixed bg-white w-[35rem] h-[14rem] top-[29rem] left-[10.5rem] rounded-[1.5rem]">Progress</div>
              <div className="fixed bg-white w-[45.5rem] h-[37rem] left-[47.5rem] rounded-[1.5rem] top-[6rem]">Pets</div>
            </div>
        </WhiteContainer>
      <SideBar />
    </>
  );
}

export default DashboardPage