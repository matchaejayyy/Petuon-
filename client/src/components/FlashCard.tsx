import { BookmarkMinus, Trash2, TrashIcon, X } from "lucide-react";
import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"
import React, { useState, useEffect } from 'react';


type Flashcard = {
    question: string;
    answer: string;
  };


type CreateFlashcardProps = {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
};

const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ flashcards, setFlashcards }) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [flashcardCreated, setFlashcardCreated] = useState<boolean>(false);
  


  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
    setFlashcardCreated(false);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    setFlashcardCreated(false);
  };

  const createFlashcard = () => {
    if (question && answer) {
      const newFlashcard: Flashcard = { question, answer };
      const updatedFlashcards = [...flashcards, newFlashcard];
      setFlashcards(updatedFlashcards);
      localStorage.setItem("currentFlashcards", JSON.stringify(updatedFlashcards));
      setQuestion('');
      setAnswer('');
      setFlashcardCreated(true);
    } else {
      setFlashcardCreated(false);
    }
  };



  return (
    <div className="bg-slate-500 min-h-28 min-w-80 flex justify-center items-center">
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        className="h-16 m-5 rounded-3xl w-1/3 p-5"
        placeholder="Insert question"
      />
      <input
        type="text"
        value={answer}
        onChange={handleAnswerChange}
        className="h-16 m-5 rounded-3xl w-1/3 p-5"
        placeholder="Insert answer"
      />
      <button
        onClick={createFlashcard}
        className="bg-lime-700 h-16 w-36 rounded-full"
      >
        Create
      </button>
    </div>
  );
};


  
  const FlashcardComponent: React.FC = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isReviewing, setisReviewing] = useState<boolean>(false);
    const [OnFirstPage, setOnFirstPage] = useState<boolean>(true)
    const [decks, setDecks] = useState<{ [key: string]: Flashcard[] }>({});
    const [DeckTitle, setDeckTitle] = useState<string>("");

    useEffect(() => {
      const storedDecks = localStorage.getItem("decks");
      const storedFlashcards = localStorage.getItem("currentFlashcards");
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks));
      }
      if (storedFlashcards) {
        setFlashcards(JSON.parse(storedFlashcards));
      }
    }, []);

    const saveDeck = () => {
      if (!DeckTitle.trim()) {
        alert("Deck title cannot be empty.");
        return;
      }
      if (flashcards.length === 0) {
        alert("You must add at least one flashcard before saving the deck.");
        return;
      }
    
      const updatedDecks = { ...decks, [DeckTitle]: flashcards };
    setDecks(updatedDecks);
    localStorage.setItem("decks", JSON.stringify(updatedDecks));

    setDeckTitle("");
    setFlashcards([]);
    localStorage.removeItem("currentFlashcards"); 
    setOnFirstPage(true);
  };
  const deleteFlashcard = (index: number) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
    localStorage.setItem("currentFlashcards", JSON.stringify(updatedFlashcards));
  };
  
  
    const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
        return (
          <ul className=" w-screen h-[70vh] flex flex-col items-center overflow-y-auto ">
            {flashcards.map((flashcard, index) => (
              <li key={index} className="w-2/3 m-3 relative">
              <div className="bg-orange-100 rounded-2xl h-52 w-full m-5 flex flex-col items-center justify-center overflow-auto relative ">
                <button className="absolute top-3 right-3 bg-red-600 h-10 w-10 rounded-full flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); deleteFlashcard(index); }}
                >
                &#x1f5d1;
                </button>
                <h1 className="text-5xl mb-5 break-words">{flashcard.question}</h1>
                <h2 className="text-xl">{flashcard.answer}</h2>
              </div>
            </li>
            ))}
          </ul>
        );
      };



      interface quizFlashcardProps {
        flashcards: Flashcard[];
      }
      
      const QuizFlashcard: React.FC<quizFlashcardProps> = ({ flashcards }) => {
        const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([...flashcards]);
        const [currentIndex, setCurrentIndex] = useState<number>(0);
        const [showAnswer, setShowAnswer] = useState<boolean>(false);
        const [QuizFinished, setQuizFinished] = useState<boolean>(false);


        function shuffleArray<T>(array: T[]): T[] {
          const shuffled = [...array]; 
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
          }
          return shuffled;
        }

        const shuffleFlashcards = () => {
          const shuffled = shuffleArray(flashcards);
          setTempFlashcards(shuffled);
          setCurrentIndex(0); 
          setShowAnswer(false); 
        };
      
        useEffect(() => {
          const shuffledCards = shuffleArray(flashcards)
          setTempFlashcards(shuffledCards);
          setCurrentIndex(0);
          setShowAnswer(false);
        }, [flashcards]);
      
        const handleNextFlashcard = () => {
          if (currentIndex < tempFlashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false); 
            setQuizFinished(true);
          }
        };
      
        const handlePreviousFlashcard = () => {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowAnswer(false);
          }
        };
      
        
        const currentFlashcard = tempFlashcards[currentIndex];
        const isQuizComplete = currentIndex === tempFlashcards.length - 1 && showAnswer && QuizFinished;
        
        
      
        return (
          <div className="flex flex-col items-center justify-center h-[80%]">
            {isQuizComplete ? (
              <div className="inline items-center justify-center">
              <div className="w-[60%] mb-8">
                <div className="h-[300px] bg-black rounded-2xl shadow-lg overflow-hidden">
                  <div
                    className="bg-orange-100 w-full h-full p-5 text-center cursor-pointer flex flex-col justify-center items-center"
                    onClick={() => setShowAnswer((prev) => !prev)}
                  >
                    <h2 className="text-4xl mb-5">{currentFlashcard.question}</h2>
                    <p className={`text-xl ${showAnswer ? "text-black" : "text-gray-400"}`}>
                      {showAnswer ? currentFlashcard.answer : "Tap to show answer"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-5 w-full">
                  <button
                    onClick={handlePreviousFlashcard}
                    className="bg-gray-800 text-white h-10 w-28 rounded-full"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextFlashcard}
                    className="bg-gray-800 text-white h-10 w-28 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center mt-8">
                <p className="text-3xl">Quiz complete! Well done!</p>
                <button
                  onClick={shuffleFlashcards}
                  className="bg-gray-800 text-white h-10 w-36 rounded-full mt-3"
                >
                  Shuffle & Restart
                </button>
                <button
                  onClick={() => setOnFirstPage(true)}
                  className="bg-gray-800 text-white h-10 w-36 rounded-full mt-3"
                >
                  Go to Flashcards
                </button>
              </div>
            </div>
            
            ) : (
              <div className="w-[60%] h-[300px] flex flex-col items-center justify-center bg-black rounded-2xl shadow-lg">
                <div
                  className="bg-orange-100 rounded-2xl p-5 w-full text-center cursor-pointer flex flex-col justify-center items-center h-full"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  <h2 className="text-4xl mb-5">{currentFlashcard.question}</h2>
                  <p className={`text-xl ${showAnswer ? "text-black" : "text-gray-400"}`}>
                    {showAnswer ? currentFlashcard.answer : "Tap to show answer"}
                  </p>
                </div>
                <div className="flex justify-between mt-5 w-full">
                  <button
                    onClick={handlePreviousFlashcard}
                    className="bg-gray-800 text-white h-10 w-28 rounded-full"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextFlashcard}
                    className="bg-gray-800 text-white h-10 w-28 rounded-full"
                    
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      };
      

      const handleCreateNewDeck = () => {
        if (DeckTitle && flashcards.length > 0) {
          saveDeck(); 
        }
        setisReviewing(false);
        setOnFirstPage(false);
        localStorage.removeItem("currentFlashcards");
        setDeckTitle(""); 
        setFlashcards([]); 
      };

      const loadDeck = (title: string) => {
        const selectedDeck = decks[title];
        setFlashcards(selectedDeck || []);
        setDeckTitle(title);
        localStorage.setItem("currentFlashcards", JSON.stringify(selectedDeck || []));
        setOnFirstPage(false);
      };

      const deleteDeck = (title: string) => {
        const updatedDecks = { ...decks };
        delete updatedDecks[title];
        setDecks(updatedDecks);
        localStorage.setItem("decks", JSON.stringify(updatedDecks));
      };

      const colors = ["bg-[#FE9B72]", "bg-[#FFC973]", "bg-[#E5EE91]", "bg-[#B692FE]"];
    
      return (
        <>
          {OnFirstPage ? (
            <div className="flex flex-col items-center mt-[-3rem] mr-[6rem] ">
              <h1
                className="text-[#354F52] text-3xl m-10 mr-[78.2rem]"
                style={{ fontFamily: '"Crimson Pro", serif' }}
              >
                Saved Decks
              </h1>
              <div className="w-[90vw] flex items-center justify-center relative mt-[-1.5rem] ">
  <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-h-[540px] overflow-y-auto p-5">
                  {Object.keys(decks).length === 0 ? (
                    <p
                      className="text-2xl text-center col-span-full "
                      style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    >
                      No decks saved yet. Create one to get started!
                    </p>
                  ) : (
                    Object.keys(decks).map((title, index) => {
                      const assignedColor = colors[index % colors.length];
    
                      return (
                        <li key={title} className="w-full">
                          <div
                            onClick={() => loadDeck(title)}
                            className={`${assignedColor} shadow-lg rounded-3xl h-[15rem] w-[18rem] p-4 flex flex-col justify-between cursor-pointer transform transition-transform duration-200 hover:scale-105 relative`}
                          >
                            <h1
                              className="text-2xl font-bold uppercase text-center flex items-center justify-center h-full w-full overflow-hidden text-ellipsis whitespace-nowrap"
                              style={{ fontFamily: '"Signika Negative", sans-serif' }}
                            >
                              {title}
                            </h1>
                            <button
                              className="absolute bottom-3 right-3  h-8 w-8 rounded-full flex items-center justify-center "
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDeck(title);
                              }}
                            >
                              <BookmarkMinus className="text-red-800 w-5 h-5 mb-[23rem]" />
                            </button>
                          </div>
                        </li> 
                      );
                    })
                  )}
                </ul>
              </div>
              <div className="fixed top-13 right-10">
                <button
                  onClick={handleCreateNewDeck}
                  className="bg-lime-700 h-16 w-36 rounded-full"
                >
                  Create New Deck
                </button>
              </div>
            </div>
          ) : isReviewing ? (
            <div>
              <div className="flex">
                <h1 className="text-5xl m-10">Review</h1>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => setisReviewing(false)}
                    className="bg-gray-800 text-white h-16 w-36 rounded-full"
                  >
                    Add Flashcards
                  </button>
                </div>
              </div>
              <div className="bg-slate-500">
                <QuizFlashcard flashcards={flashcards} />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex">
                <h1 className="text-5xl m-10">Create Flashcards!</h1>
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    value={DeckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    className="h-16 m-5 rounded-3xl w-1/3 p-5"
                    placeholder="Title"
                  />
                  <button
                    onClick={saveDeck}
                    className="bg-lime-700 h-16 w-36 rounded-full"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setisReviewing(true)}
                    className="bg-gray-800 text-white h-16 w-36 rounded-full m-10"
                  >
                    Start Learning!
                  </button>
                  <button
                    onClick={() => setOnFirstPage(true)}
                    className="bg-blue-400 text-white h-16 w-20 rounded-full text-4xl ml-10 text-center"
                  >
                    &#8592;
                  </button>
                </div>
              </div>
              <CreateFlashcard flashcards={flashcards} setFlashcards={setFlashcards} />
              <FlashcardList flashcards={flashcards} />
            </div>
          )}
        </>
      );
    };
    const FlashCard = () => {
      return (
        <>
          <WhiteContainer>
          <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7">FlashCards</h1>
            <FlashcardComponent />
          </WhiteContainer>
          <SideBar />
        </>
      );
    };
    
    export default FlashCard;
