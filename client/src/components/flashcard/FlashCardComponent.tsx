import React, { useState } from "react";
import { useFlashcardHooks } from "../../hooks/UseFlashcard";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";
import { FolderPlus, BookmarkMinus, Minus, CircleArrowLeft } from "lucide-react";
import { Deck, Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";

const token = localStorage.getItem('token');

const FlashcardComponent: React.FC = () => {
  const {
    flashcards,
    decks,
    isReviewing,
    onFirstPage,
    deckTitle,
    deckId,
    setFlashcards,
    setDeckTitle,
    setDecks,
    setIsReviewing,
    setOnFirstPage,
    saveDeck,
    loadDeck,
    deleteDeck,
    deleteFlashcard,
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
      <div className="-mt-[2.5rem] p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-5 max-h-[250px] overflow-x-auto scrollbar-thin ">
        {flashcards.map((flashcard) => (
          <div
            key={flashcard.unique_flashcard_id}
            className="relative flex flex-col w-[40rem] h-[10rem] bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-100 transition mx-auto"
          >
            {/* Question Card */}
            <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="mb-4 text-center">
              {editingQuestion === flashcard.unique_flashcard_id ? (
                <input
                  type="text"
                  defaultValue={flashcard.question}
                  onBlur={(e) => handleSaveQuestion(flashcard.unique_flashcard_id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, flashcard.unique_flashcard_id, e.currentTarget.value, "question")}
                  className="w-full p-2 border rounded-lg"
                  autoFocus
                />
              ) : (
                <p
                  className="font-semibold text-[#354F52] break-words cursor-pointer"
                  onClick={() => handleEditQuestion(flashcard.unique_flashcard_id)}
                >
                  {flashcard.question}
                </p>
              )}
            </div>

            {/* Answer Card (Hidden by default) */}
            <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="mt-4 text-center text-[#52796F]">
              {editingAnswer === flashcard.unique_flashcard_id ? (
                <textarea
                  defaultValue={flashcard.answer}
                  onBlur={(e) => handleSaveAnswer(flashcard.unique_flashcard_id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, flashcard.unique_flashcard_id, e.currentTarget.value, "answer")}
                  className="w-full p-2 border rounded-lg"
                  autoFocus
                  aria-label="Edit answer"
                />
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => handleEditAnswer(flashcard.unique_flashcard_id)}
                >
                  {flashcard.answer}
                </p>
              )}
            </div>

            {/* Delete Button */}
            <button
              className="absolute top-4 right-4 flex items-center justify-center transform transition-transform duration-200 hover:scale-125"
              onClick={() => {
                if (flashcard.unique_flashcard_id) {
                  deleteFlashcard(flashcard.unique_flashcard_id);
                } else {
                  console.error("Flashcard unique_flashcard_id is undefined");
                }
              }}
            >
              <Minus className="text-red-500 mt-[-.5rem] w-8 h-8" />
            </button>

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
      {onFirstPage ? (
        <div className="flex flex-col items-center mt-[-3rem] mr-[6rem] ">
          <div className=" h-24 w-full mt-20 flex items-center ">
          <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-[#354F52] text-3xl ">
            Create a new Deck
          </h1>
            <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="h-16 m-5 rounded-3xl w-[30rem] p-5 shadow-lg mt-[1rem] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
                placeholder="Title"
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
                  const newDeck = deckData.find((deck: Deck) => deck.title === deckTitle);
                  if (newDeck) {
                  loadDeck(newDeck.deck_id);
                  }
                }}
                className="flex"
                >
                <FolderPlus className="w-10 h-10 ml-[1rem] text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" />
                </button>
          </div>
          <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-[#354F52] text-3xl m-10 mt-1 mr-[70rem]">
            Decks
          </h1>
          <div className="w-[94vw] flex items-center justify-center relative ml-[1.5rem] mt-[-1.5rem] ">
            <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ml-7 max-h-[540px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2">
              {Object.keys(decks).length === 0 ? (
                <p
                  className="text-2xl text-gray-500 text-center col-span-full "
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  No decks saved yet. Create one to get started!
                </p>
              ) : (
                decks.map(({ title, deck_id}, index) => {
                  const assignedColor = colors[index % colors.length];

                  return (
                    <li key={title} className="w-full ml-[3rem]">
                      <div
                        onClick={() => {loadDeck(deck_id)}}
                        className={`${assignedColor} shadow-lg rounded-3xl h-[15rem] w-[18rem] p-4 flex flex-col justify-between cursor-pointer transform transition-transform duration-200 hover:scale-105 relative`}
                      >
                        <h1
                          className="text-2xl font-bold uppercase text-center flex items-center justify-center h-full w-full overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{
                            fontFamily: '"Signika Negative", sans-serif',
                          }}
                        >
                          {title}
                        </h1>
                        <button
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-full flex items-center justify-center"
                          onClick={(e) => {
                          e.stopPropagation();
                          deleteDeck(deck_id);
                          }}
                        >
                          <BookmarkMinus className="text-red-800 w-5 h-5 mb-[23rem] transform transition-transform duration-200 hover:scale-125 hover:text-red-900" />
                        </button>
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
          <div className="flex items-center bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-lg">
                 <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="-ml-[0.1rem] mt-[0.2rem] mr-96 font-serif text-2xl text-white font-bold uppercase">
              Deck: 
            </h1>
            </div>
            <h1  style={{ fontFamily: '"Signika Negative", sans-serif' }} className="-ml-[8.25rem] mt-[0.6rem] mr-96 font-serif text-2xl text-white font-bold uppercase">
              {decks.find(deck => deck.deck_id === deckId)?.title?.length > 5 
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 5) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
            </h1>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setIsReviewing(false)}
                className="flex mt-[-2.8rem] ml-[-2.8rem]"
              >
                <FolderPlus className="w-10 h-10 ml-[1rem]  text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F] " />
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
          <div className="flex items-center bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-lg">
                <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="-ml-[0.1rem] mt-[0.2rem]  text-2xl text-white font-bold uppercase">
                Deck:
                </h1>
                <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="ml-1 mt-[0.2rem] mr-96 font-serif text-2xl text-white font-bold uppercase">
                {decks.find(deck => deck.deck_id === deckId)?.title?.length > 5 
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 5) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
              <button
                onClick={() => {setIsReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className=" text-white text-2xl bg-[#354F52] p-4 w-[5rem] h-[3rem] rounded-lg m-10 mt-[10rem] -ml-[30rem] shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110" >
                Review Deck
              </button>
              <button
          onClick={() => {setOnFirstPage(true); console.log("Clicked Review");}}
          className="text-4xl ml-[-0.5rem] text-center transform transition-transform duration-200 hover:scale-125"
              >
          <CircleArrowLeft className="w-10 h-10 text-[#657F83] hover:text-[#52796F]" />
              </button>
            </div>
          </div>
          <CreateFlashcard
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            flashCardId={deckId}          
          />
          {flashcards.length > 0 ? (
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