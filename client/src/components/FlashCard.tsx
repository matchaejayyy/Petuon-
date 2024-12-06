import {
  BookmarkMinus,
  CircleArrowLeft,
  CircleArrowRight,
  CopyPlus,
  FolderPlus,
  ListPlus,
  Minus,
} from "lucide-react";
import SideBar from "./SideBar";
import WhiteContainer from "./WhiteContainer";
import React, { useState, useEffect } from "react";
import Avatar from "../components/Avatar";

type Flashcard = {
  question: string;
  answer: string;
};

type CreateFlashcardProps = {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
};

const CreateFlashcard: React.FC<CreateFlashcardProps> = ({
  flashcards,
  setFlashcards,
}) => {
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
      localStorage.setItem(
        "currentFlashcards",
        JSON.stringify(updatedFlashcards),
      );
      setQuestion("");
      setAnswer("");
      setFlashcardCreated(true);
    } else {
      setFlashcardCreated(false);
    }
  };

  return (
    <div className="mt-[-2rem] flex flex-col items-center justify-center gap-10 p-4 md:flex-row">
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="h-16 w-full transform rounded-3xl border-2 border-[#52796F] bg-[#657F83] p-5 text-white placeholder-gray-300 shadow-xl transition-transform duration-200 hover:scale-105 focus:scale-105 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52796F] md:w-1/3"
        placeholder="Insert question"
      />
      <input
        type="text"
        value={answer}
        onChange={handleAnswerChange}
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="h-16 w-full transform rounded-3xl border-2 border-[#52796F] bg-[#657F83] p-5 text-white placeholder-gray-300 shadow-xl transition-transform duration-200 hover:scale-105 focus:scale-105 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52796F] md:w-1/3"
        placeholder="Insert answer"
      />
      <button
        onClick={createFlashcard}
        className="flex h-16 w-16 transform items-center justify-center rounded-full bg-[#657F83] font-semibold text-white shadow-xl transition duration-200 hover:scale-110 hover:bg-[#52796F] hover:shadow-lg"
      >
        <ListPlus className="ml-2 h-10 w-10" />
      </button>
    </div>
  );
};

const FlashcardComponent: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isReviewing, setisReviewing] = useState<boolean>(false);
  const [OnFirstPage, setOnFirstPage] = useState<boolean>(true);
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
    localStorage.setItem(
      "currentFlashcards",
      JSON.stringify(updatedFlashcards),
    );
  };

  const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({
    flashcards,
  }) => {
    return (
      <ul className="-mt-[1rem] mr-[7rem] flex h-[70vh] flex-col items-center overflow-y-auto p-0 [&::-webkit-scrollbar]:w-2">
        {flashcards.map((flashcard, index) => {
          const assignedColor = colors[index % colors.length];
          return (
            <li
              key={index}
              className="relative m-[7rem] ml-[7rem] mt-10 w-2/3 transform transition-transform duration-200 hover:scale-105"
            >
              <div
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className={`${assignedColor} relative flex h-[20rem] w-full flex-col items-center justify-center overflow-auto rounded-2xl shadow-lg`}
              >
                <button
                  className="absolute right-4 top-4 flex transform items-center justify-center transition-transform duration-200 hover:scale-125"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlashcard(index);
                  }}
                >
                  <Minus className="mt-[-.5rem] h-8 w-8 text-red-500" />
                </button>
                <h1 className="mb-5 break-words text-5xl">
                  {flashcard.question}
                </h1>
                <h2 className="text-xl">{flashcard.answer}</h2>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  interface quizFlashcardProps {
    flashcards: Flashcard[];
  }

  const QuizFlashcard: React.FC<quizFlashcardProps> = ({ flashcards }) => {
    const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([
      ...flashcards,
    ]);
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
      const shuffledCards = shuffleArray(flashcards);
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
    const isQuizComplete =
      currentIndex === tempFlashcards.length - 1 && showAnswer && QuizFinished;

    return (
      <div className="flex h-[80%] flex-col items-center justify-center">
        {isQuizComplete ? (
          <div className="inline items-center justify-center">
            <div className="mb-8">
              <div className="ml-[-8rem] h-[300px] w-[80rem] overflow-hidden rounded-2xl bg-black shadow-lg">
                <div
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center bg-[#FE9B72] p-5 text-center"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  <h2
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="mb-5 text-4xl"
                  >
                    {currentFlashcard.question}
                  </h2>
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className={`text-xl ${showAnswer ? "text-black" : "text-gray-200"}`}
                  >
                    {showAnswer
                      ? currentFlashcard.answer
                      : "Tap to show answer"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex w-full justify-between">
                <button
                  onClick={handlePreviousFlashcard}
                  className="ml-[-8rem] flex transform items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
                  disabled={currentIndex === 0}
                >
                  <CircleArrowLeft className="h-[3.5rem] w-[3.5rem] text-[#354F52]" />
                </button>
                <button
                  onClick={handleNextFlashcard}
                  className="flex transform items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" //1234
                >
                  <CircleArrowRight className="h-[3.5rem] w-[3.5rem] text-[#354F52]" />
                </button>
              </div>
            </div>

            <div className="ml-[21rem] mt-[-5rem] flex flex-col">
              <p
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-4xl"
              >
                Quiz complete! Well done!
              </p>
              <button
                onClick={shuffleFlashcards}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="ml-[7rem] mt-5 h-10 w-36 transform rounded-full bg-[#354F52] text-white transition-transform duration-200 hover:scale-125 hover:text-white"
              >
                Shuffle & Restart
              </button>
              <button
                onClick={() => setOnFirstPage(true)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="ml-[7rem] mt-5 h-10 w-36 transform rounded-full bg-[#354F52] text-white transition-transform duration-200 hover:scale-125 hover:text-white"
              >
                Go to Flashcards
              </button>
            </div>
          </div>
        ) : (
          <div className="ml-[-8rem] flex h-[450px] w-[80%] flex-col items-center justify-center rounded-2xl">
            <div
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-[#FE9B72] p-5 text-center shadow-lg"
              onClick={() => setShowAnswer((prev) => !prev)}
            >
              <h2
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="mb-5 text-6xl"
              >
                {currentFlashcard.question}
              </h2>
              <p
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className={`text-3xl ${showAnswer ? "text-black" : "text-gray-400"}`}
              >
                {showAnswer ? currentFlashcard.answer : "Tap to show answer"}
              </p>
            </div>
            <div className="mt-5 flex w-full justify-between">
              <button
                onClick={handleNextFlashcard}
                className="flex transform items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
              >
                <CircleArrowLeft className="h-[3.5rem] w-[3.5rem] text-[#354F52]" />
              </button>
              <button
                onClick={handleNextFlashcard}
                className="flex transform items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
              >
                <CircleArrowRight className="h-[3.5rem] w-[3.5rem] text-[#354F52]" />
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
    localStorage.setItem(
      "currentFlashcards",
      JSON.stringify(selectedDeck || []),
    );
    setOnFirstPage(false);
  };

  const deleteDeck = (title: string) => {
    const updatedDecks = { ...decks };
    delete updatedDecks[title];
    setDecks(updatedDecks);
    localStorage.setItem("decks", JSON.stringify(updatedDecks));
  };

  const colors = [
    "bg-[#FE9B72]",
    "bg-[#FFC973]",
    "bg-[#E5EE91]",
    "bg-[#B692FE]",
  ];

  return (
    <>
      {OnFirstPage ? (
        <div className="mr-[6rem] mt-[-3rem] flex flex-col items-center">
          <h1 className="m-10 mr-[71rem] font-serif text-3xl text-[#354F52]">
            SavedDecks
          </h1>
          <div className="relative ml-[9rem] mt-[-1.5rem] flex w-[94vw] items-center justify-center">
            <ul className="grid max-h-[540px] w-full grid-cols-2 gap-5 overflow-y-auto p-5 md:grid-cols-3 lg:grid-cols-4 [&::-webkit-scrollbar]:w-2">
              {Object.keys(decks).length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src="src/assets/sleeping_penguin2.gif"
                    alt="No notes available"
                    className="ml-[65rem] mt-[3.5rem] h-[15rem] w-[15rem]"
                  />
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="-mr-[67rem] -mt-[1.5rem] text-2xl text-gray-500"
                  >
                    No notes available.
                  </p>
                </div>
              ) : (
                Object.keys(decks).map((title, index) => {
                  const assignedColor = colors[index % colors.length];

                  return (
                    <li key={title} className="w-full">
                      <div
                        onClick={() => loadDeck(title)}
                        className={`${assignedColor} relative flex h-[15rem] w-[18rem] transform cursor-pointer flex-col justify-between rounded-3xl p-4 shadow-lg transition-transform duration-200 hover:scale-105`}
                      >
                        <h1
                          className="flex h-full w-full items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-center text-2xl font-bold uppercase"
                          style={{
                            fontFamily: '"Signika Negative", sans-serif',
                          }}
                        >
                          {title}
                        </h1>
                        <button
                          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDeck(title);
                          }}
                        >
                          <BookmarkMinus className="mb-[23rem] h-5 w-5 transform text-red-800 transition-transform duration-200 hover:scale-125 hover:text-red-900" />
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div className="fixed right-[3.9rem] top-[6rem]">
            <button
              onClick={handleCreateNewDeck}
              className="flex scale-125 items-center justify-center"
            >
              <CopyPlus className="mr-[61.8rem] mt-[1rem] h-7 w-7 transform text-[#354F52] transition-transform duration-200 hover:scale-125" />
            </button>
          </div>
        </div>
      ) : isReviewing ? (
        <div>
          <div className="flex">
            <h1 className="m-10 ml-[2.1rem] mt-[-0.5rem] font-serif text-3xl text-[#354F52]">
              Review
            </h1>
            <div className="flex items-center justify-center">
              <button
                onClick={() => setisReviewing(false)}
                className="ml-[-2.8rem] mt-[-2.8rem] flex"
              >
                <FolderPlus className="ml-[1rem] h-10 w-10 transform text-[#354F52] transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" />
              </button>
            </div>
          </div>
          <div className="b">
            <QuizFlashcard flashcards={flashcards} />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex">
            <h1 className="m-10 ml-[2.1rem] mt-[-0.5rem] font-serif text-3xl text-[#354F52]">
              Create Flashcards!
            </h1>
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={DeckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="m-5 mt-[1rem] h-16 w-[30rem] transform rounded-3xl p-5 shadow-lg transition-transform duration-200 hover:scale-105 focus:scale-105"
                placeholder="Title"
              />
              <button onClick={saveDeck} className="flex">
                <FolderPlus className="ml-[1rem] h-10 w-10 transform text-[#354F52] transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" />
              </button>
              <button
                onClick={() => setisReviewing(true)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="m-10 h-16 w-36 transform rounded-3xl bg-[#657F83] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-[#52796F]"
              >
                Start Learning!
              </button>
              <button
                onClick={() => setOnFirstPage(true)}
                className="ml-[-0.5rem] transform text-center text-4xl transition-transform duration-200 hover:scale-125"
              >
                <CircleArrowLeft className="h-10 w-10 text-[#657F83] hover:text-[#52796F]" />
              </button>
            </div>
          </div>
          <CreateFlashcard
            flashcards={flashcards}
            setFlashcards={setFlashcards}
          />
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
        <h1
          style={{ fontFamily: '"Crimson Pro", serif' }}
          className="ftracking-normal mb-4 mt-7 text-[3rem] text-[#354F52]"
        >
          FlashCards
        </h1>
        <FlashcardComponent />
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default FlashCard;
