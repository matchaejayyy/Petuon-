import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"

export default function Calendar() {
    return (
        <>
        <WhiteContainer>
            <div>
                <h1
                    className="text-[2rem] text-[#354F52] font-serif font-bold tracking-normal mb-4 ml-8 mt-7" > Calendar
                </h1>
            </div>
      </WhiteContainer>
         <SideBar/>
        </>
    )
}