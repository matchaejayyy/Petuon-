import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"

export default function Calendar() {
    return (
        <>
        <WhiteContainer>
            <div>
                <h1
                    style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7" > Calendar
                </h1>
            </div>
      </WhiteContainer>
         <SideBar/>
        </>
    )
}