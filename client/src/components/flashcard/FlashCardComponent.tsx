import React, { useState } from "react";
import { useFlashcardHooks } from "../../hooks/UseFlashcard";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";
import { Minus, FilePenLine } from "lucide-react";
import { Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";
import Modal from "../modal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const token = localStorage.getItem('token');

const FlashcardComponent: React.FC = () => {
  const {
    loadDecks,
    loadCards,
    flashcards,
    decks,
    isReviewing,
    onFirstPage,
    deckTitle,
    deckId,
    isModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    setIsModalOpen,
    setFlashcards,
    setDeckTitle,
    setDecks,
    setIsReviewing,
    setOnFirstPage,
    saveDeck,
    loadDeck,
    deleteDeck,
    deleteFlashcard,
    setDeckId,
    handleUpdateDeckTitle
  } = useFlashcardHooks();

  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);

  const handleEditQuestion = (flashcardId: string) => {
    setEditingQuestion(flashcardId);
  };

  const handleEditAnswer = (flashcardId: string) => {
    setEditingAnswer(flashcardId);
  };

  const handleSaveQuestion = (flashcardId: string, newQuestion: string) => {
    updateFlashcard(flashcardId, newQuestion, "question");
    setEditingQuestion(null);
  };

  const handleSaveAnswer = (flashcardId: string, newAnswer: string) => {
    updateFlashcard(flashcardId, newAnswer, "answer");
    setEditingAnswer(null);
  };

  const updateFlashcard = async (flashcardId: string, newValue: string, field: "question" | "answer") => {
    try {
      // API call to update the flashcard
      await axios.put(`http://localhost:3002/cards/updateFlashcard/${flashcardId}`, {
        [field]: newValue,
      });

      // Optimistically update the flashcards state to reflect the change
      setFlashcards(prevFlashcards => 
        prevFlashcards.map(flashcard => 
          flashcard.unique_flashcard_id === flashcardId
            ? { ...flashcard, [field]: newValue } // Update the modified field
            : flashcard
        )
      );

      console.log(`${field} updated successfully!`);
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, flashcardId: string, newValue: string, field: "question" | "answer") => {
    if (e.key === 'Enter') {
      if (field === "question") {
        handleSaveQuestion(flashcardId, newValue);
      } else if (field === "answer") {
        handleSaveAnswer(flashcardId, newValue);
      }
    }
  };
  

  const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
    return (
      <div
      className="-mt-[3rem] p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-5 max-h-[260px] overflow-x-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-500"
      id="flashcards-container"
    >
      {flashcards.map((flashcard, index) => (
        <div
          key={flashcard.unique_flashcard_id}
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="relative flex flex-col w-full sm:w-[40rem] h-[15rem] bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-100 mx-auto"
        >
          {/* Top Colored Section */}
          <div className="bg-[#354F52] h-[20%] w-full rounded-t-2xl  flex items-center justify-between px-4 relative">
            {/* Flashcard Index */}
            <span className="text-white text-lg font-semibold">{index + 1}</span>
    
            {/* Delete Button */}
            <button
              className="flex items-center justify-center transform transition-transform duration-200 hover:scale-125"
              onClick={() => {
                if (flashcard.unique_flashcard_id) {
                  deleteFlashcard(flashcard.unique_flashcard_id);
                } else {
                  console.error("Flashcard unique_flashcard_id is undefined");
                }
              }}
            >
              <Minus className="text-red-500 w-8 h-8" />
            </button>
          </div>
    
          {/* Main Content */}
          <div className="flex flex-col w-full items-start p-4 -mt-1 gap-4">
            {/* Question Field */}
            <div className="flex flex-col w-full">
              <label className="text-[#354F52] text-sm ml-1 mb-1">Question</label>
              <input
                type="text"
                className="bg-gray-200 text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                value={flashcard.question}
                readOnly
                placeholder="QUESTION"
              />
            </div>

            {/* Answer Field */}
            <div className="flex flex-col w-full">
              <label className="text-[#354F52] text-sm ml-1 mb-1">Answer</label>
              <input
                type="text"
                className="bg-gray-200 text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                value={flashcard.answer}
                readOnly
                placeholder="ANSWER"
              />
            </div>
          </div>
          </div>
        ))}
      </div>
        );
      };
  const colors = [
    "bg-[#FE9B72]",
    "bg-[#FFC973]",
    "bg-[#E5EE91]",
    "bg-[#B692FE]",
  ];
  return (
    <>
     <ToastContainer />
     {onFirstPage ? (
        <div className="flex flex-col items-center mt-[-3rem] mr-[7rem] ">
          <div className=" h-24 w-full mt-20 flex items-center "> 
            <h1 style={{ fontFamily: '"Signika Negative", sans-serif'}} className="text-[#354F52] ml-[3.5rem] text-5xl absolute left-1/3 transform -translate-x-1/4 -mt-[8rem]">Decks of Flash Cards</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute right-[11rem] top-[6.5rem] flex items-center justify-center w-[10rem] h-[3rem] rounded-xl bg-[#354F52] hover:bg-[#52796F] transition duration-300"
              >
                {/* Text */}
                <span
                  className="text-white font-semibold"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  Create Deck
                </span>
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl font-bold mb-4">Create a New Deck</h2>
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await saveDeck();
                    const response = await axios.get(`http://localhost:3002/cards/getDecks`, {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
                      deck_id: deck.deck_id,
                      title: deck.title,
                    }));
                    setDecks(deckData);
                    setDeckTitle(''); // Clear input field
                  }
                }}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="w-full p-2 border border-[#354F52] rounded-md mb-4 focus:border-[#354F52]"
                placeholder="Enter deck title"
              />
              <button
                onClick={async () => {
                  await saveDeck();
                  const response = await axios.get(`http://localhost:3002/cards/getDecks`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
                    deck_id: deck.deck_id,
                    title: deck.title,
                  }));
                  setDecks(deckData);
                  setDeckTitle(''); // Clear input field
                  setIsModalOpen(false);
                }}
                className="flex items-center justify-center px-4 py-2 ml-[15.7rem]  bg-[#354F52]  rounded transition-transform duration-200 hover:scale-105 hover:text-[#52796F] hover:bg-[#657F83] ]"
                >
                  <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg text-white font-semibold">Create</span>
                </button>
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl font-semibold mb-4">Edit Deck Title</h2>
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    // Update deck title and refresh deck list
                    await handleUpdateDeckTitle();
                    setDeckTitle(''); // Clear input field
                  }
                }}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
               className="w-full p-2 border border-[#354F52] rounded-md mb-4 focus:border-[#354F52]"
                placeholder="Enter new deck title"
              />
              <button
              onClick={async () => {
                // Update deck title and refresh deck list
                await handleUpdateDeckTitle();
                setDeckTitle(''); // Clear input field
              }}
              className="flex items-center justify-center px-4 py-2 ml-[16.7rem]  bg-[#354F52]  rounded transition-transform duration-200 hover:scale-105 hover:text-[#52796F] hover:bg-[#657F83] ]"
                >
                  <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg text-white font-semibold">Save</span>
            </button>
            </Modal>
          </div>
          <div className="w-[94vw] flex items-center justify-center relative ml-[1.5rem] mt-[-4rem] ">
            <ul  className="w-[94vw] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ml-7 max-h-[500px] overflow-y-auto overflow-x-hidden p-2 [&::-webkit-scrollbar]:w-2">
              {/* Loading State */}
                {loadDecks ? (
                  <p className="text-2xl text-gray-500 text-center col-span-full">
                    Fetching cards...
                  </p>
                ) : Object.keys(decks).length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-[16rem] text-center">
                  <img
                    src="src\assets\sleeping_penguin2.gif"
                    alt="No notes available"
                    className="ml-[66rem] mt-[-13rem] h-[15rem] w-[15rem] "
                  />
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                   className="text-2xl text-gray-500 -mr-[66rem] -mt-[1.5rem]"
                  >
                    No decks saved yet. Create one to get started!
                  </p>
                </div>
                ) : null}

                {/* Render Decks */}
            {!loadDecks && Object.keys(decks).length > 0 && (
              decks.map((deck, index) => {
                const assignedColor = colors[index % colors.length];

                return (
                  <li key={deck.title} className="w-full ml-[3rem] ">
                    <div
                      onClick={() => { loadDeck(deck.deck_id); }}
                      className="shadow-lg rounded-3xl w-[18rem] flex flex-col cursor-pointer transform transition-transform duration-200 hover:scale-105 relative"
                    >
                      {/* Top Colored Section */}
                      <div
                        className={`${assignedColor} rounded-t-3xl h-[4.5rem] w-full p-4 flex justify-between items-center relative`}
                      >
                        {/* Container for Buttons positioned at the top right */}
                        <div className="absolute top-1 right-0 flex space-x-[-0.2rem] p-2">
                          {/* Edit Button */}
                          <button
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditModalOpen(true);
                              setDeckId(deck.deck_id);
                            }}
                          >
                            <FilePenLine className="w-5 h-5 transform text-[#354F52] transition-transform duration-200 hover:scale-125" />
                          </button>

                          {/* Delete Button */}
                          <button
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDeck(deck.deck_id);
                            }}
                          >
                            <Minus className="text-red-800 w-8 h-8 transform transition-transform duration-200 hover:scale-125 hover:text-red-900" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom White Section */}
                      <div className="bg-white rounded-b-3xl p-4 flex justify-center items-center h-[10rem]">
                        <h1
                          className="text-2xl text-[#354F52] font-bold uppercase text-center overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{
                            fontFamily: '"Signika Negative", sans-serif',
                          }}
                        >
                          {deck.title}
                        </h1>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
            </ul>
          </div>
          <div className="fixed top-[6rem] right-[3.9rem]">
          </div>
        </div>
      ) : isReviewing ? (
        <div>
          <div className="flex">
          <div className="flex items-center p-4 w-[13.5rem] h-[3rem] rounded-2xl">
          <div
              className="flex items-center bg-[#354F52] text-white text-xl font-bold px-8 py-3 w-[20em] -ml-[3rem] rounded-r-md shadow-lg"
              style={{
                fontFamily: '"Signika Negative", sans-serif',
                clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)",
              }}
            >
              
              <h1 className="ml-2 uppercase">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
            </div>
              </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setIsReviewing(false)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
               className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[2rem] absolute left-0 top-1/4 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
                >
                Return to deck
                </button>
            </div>
          </div>
          <div className="b">
            <QuizFlashcard
              flashcards={flashcards}
              setOnFirstPage={setOnFirstPage}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex">
          <div className="flex items-center p-4 w-[13.5rem] h-[3rem] rounded-2xl">
          <div
              className="flex items-center bg-[#354F52] text-white text-xl font-bold px-8 py-3 w-[20rem] -ml-[3rem] rounded-r-md shadow-lg"
              style={{
                fontFamily: '"Signika Negative", sans-serif',
                clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)",
              }}
            >
             
              <h1 className="ml-2 uppercase">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
            </div>
              <div>
                <button
                onClick={() => {setIsReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
               className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[2rem] absolute left-0 top-1/4 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
                >
                Review Deck
                </button>
              </div>
              <div>
              <div>
              
               <button
                onClick={() => { setOnFirstPage(true); console.log("Clicked Review"); }}
                className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[6rem] absolute left-0 top-1/3 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
              >
                Back
              </button>

                </div>
              </div>
              <button
               //  onClick={handleStartNewQuiz}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[2rem] absolute left-0 top-1/3 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
              >
                Start Quiz
              </button>
 
            </div>
          </div>
          <CreateFlashcard
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            flashCardId={deckId}          
          />
         {loadCards ? (
            <p className="text-2xl text-gray-500 text-center mt-10" style={{ fontFamily: '"Signika Negative", sans-serif' }}>
              Fetching flashcards...
            </p>
          ) : flashcards.length > 0 ? (
            <FlashcardList flashcards={flashcards} />
          ) : (
            <p className="text-2xl text-gray-500 text-center mt-10" style={{ fontFamily: '"Signika Negative", sans-serif' }}>
              No flashcards available. Create one to get started!
            </p>
          )}
        </div>
      )}
    </>
  );
};


export default FlashcardComponent;