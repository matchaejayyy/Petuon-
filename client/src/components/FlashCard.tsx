import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"

export default function FlashCard() {
    return (
        <>
        <WhiteContainer>
            <div>
                <h1
                    className="text-[2rem] text-[#354F52] font-serif font-bold tracking-normal mb-4 ml-8 mt-7" > FlashCard
                </h1>
            </div>
        </WhiteContainer>    
            <SideBar/>
        </>
    )
}