import WhiteContainer from "../components/WhiteContainer";
import Sidebar from "../components/SideBar";
import Avatar from "../components/AvatarModal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import FlashcardComponent from "../components/flashcard/FlashCardComponent";

const FlashCardPage = () => {
  return(
    <>  
         
        <WhiteContainer>
            <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-1 mt-7">Flashcards</h1>
            <FlashcardComponent/>
            <Avatar/>
            <ToastContainer
                position="top-center" // This makes the toast appear at the top center
                autoClose={3000} // Adjust the auto-close time if needed
                hideProgressBar={false} // Show the progress bar
                newestOnTop={true} // New toasts appear at the top of the stack
                closeOnClick // Close on click
                rtl={false} // Set to true for right-to-left layout
                pauseOnFocusLoss
                draggable
            />
        </WhiteContainer>
        <Sidebar/>

    </>
)
};

export default FlashCardPage;