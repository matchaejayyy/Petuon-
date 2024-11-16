import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"

export default function Notepad(){
    return (
        <>
        <WhiteContainer>
            <div>
                <h1
                    className="text-[2rem] font-serif font-bold tracking-normal mb-4 ml-8 mt-7" > Notes 
                </h1>
            </div>
         </WhiteContainer>
        <SideBar/>
        </>
    )
}