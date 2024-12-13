import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { quizFlashcardProps, Flashcard } from "../../types/FlashCardTypes";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const QuizFlashcard: React.FC<quizFlashcardProps> = ({ setOnFirstPage, flashcards }) => {
  const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("")
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [quizState, setQuizState] = useState<"review" | "fillBlanks" | "finished">("review")
  const [userScore, setUserScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(3);

  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setTempFlashcards(shuffleArray(flashcards));
    }
    console.log("Updated Score:", userScore);
    console.log("Updated attempts:", attempts);
    console.log("state:", quizState)
  }, [flashcards, userScore, attempts, quizState]);
  

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const shuffleFlashcards = () => {
    const shuffled = shuffleArray(tempFlashcards);
    setTempFlashcards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    // setQuizFinished(false);
  };

  const handleNextFlashcard = () => {
    const isCorrectAnswer = userInput.trim().toLowerCase() === currentFlashcard?.answer.trim().toLowerCase();
    if (quizState === "review") {
      if (currentIndex < tempFlashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        setQuizState("finished");
      }
    } else if (quizState === "fillBlanks") {
      if (isCorrectAnswer || attempts === 0) {
        if (currentIndex < tempFlashcards.length - 1) {
          // Move to next flashcard if not the last question
          setCurrentIndex(currentIndex + 1);
          setAttempts(3); // Reset attempts for the next flashcard
          setUserInput(""); // Clear input for the next question
        } else {
          // End quiz if on the last question
          setQuizState("finished");
        }
      } else if (attempts > 0 && !isCorrectAnswer && userInput === "") {
        if (currentIndex < tempFlashcards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Explicitly check if on the last flashcard and finish quiz
          setQuizState("finished");
        }
      } else if (!isCorrectAnswer) {
        // Deduct an attempt for an incorrect answer
        setAttempts(attempts - 1);
        toast.warn("Incorrect answer. Try again.");
      }
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setUserInput("");
    }
  };

  const handleStartNewQuiz = () => {
    setQuizState("fillBlanks");
    setCurrentIndex(0);
  };

  const handleCheckAnswer = async () => {
    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = tempFlashcards[currentIndex]?.answer.trim().toLowerCase();
  
    if (userAnswer === correctAnswer) {
      toast.success("Correct answer! Well done!");
      setUserScore(userScore + 1);
  
      if (currentIndex === tempFlashcards.length - 1) {
        setQuizState("finished"); // Mark quiz finished on correct answer for last question
      } else {
        setAttempts(3); // Reset attempts for the next question
        handleNextFlashcard();
      }
    } else if (attempts > 1) {
      toast.error("Incorrect answer, please try again.");
      setAttempts(attempts - 1); // Reduce attempts
    } else {
      toast.error("No more attempts left. Moving to the next question.");
      if (currentIndex === tempFlashcards.length - 1) {
        setQuizState("finished"); // Mark quiz finished on no attempts for last question
      } else {
        setAttempts(3); // Reset attempts for the next question
        handleNextFlashcard();
      }
    }
  
    setUserInput(""); // Clear input field
  };
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleInputKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleCheckAnswer();
    }
  };

  const currentFlashcard = tempFlashcards[currentIndex];
  const isQuizComplete =
  currentIndex === tempFlashcards.length - 1 && quizState === "finished" &&
  (showAnswer);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {quizState === "fillBlanks" ? (
        // Fill-in-the-blank quiz UI
        <div className="flex flex-col items-center">
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="w-[800px] h-[400px] -mt-[17rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <h2 className="text-3xl font-semibold text-[#354F52] break-words max-w-full p-5">
              {currentFlashcard ? `Fill in the blank: ${currentFlashcard.question.replace(
                /___/g,
                "_____"
              )}` : "Loading..."}
            </h2>
          </div>

          {/* Input for fill-in-the-blank */}
          <input
            type="text"
            value={userInput}
            placeholder="Your answer"
            className="mt-5 p-2 border border-[#354F52] rounded-md"
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-[600px] mt-5">
            <button
              onClick={handlePreviousFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-175 active:scale-50 mt-[2rem]"
              disabled={currentIndex === 0}
            >
              <CircleArrowLeft className="w-10 h-10 text-[#354F52]" />
            </button>
            <div className="bg-[#354F52] rounded-lg p-2 mt-[2rem]">
              <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl text-white font-medium mt-[2.5rem]">
                {currentIndex + 1} / {tempFlashcards.length}
              </span>
            </div>
            <button
              onClick={handleNextFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-175 active:scale-50 mt-[2rem]"
            >
              <CircleArrowRight className="w-10 h-10 text-[#354F52]" />
            </button>
          </div>
        </div>
      ) : isQuizComplete ? (
        <div className="flex flex-col items-center">
          {/* Quiz Completion UI */}
          <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-5xl text-[#354F52] font-bold mb-4 -mt-[16rem]">
            FlashCard Complete! Well Done!
          </h2>
          <p
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="text-2xl text-[#354F52] mt-4"
            >
          Your Score: {userScore} / {tempFlashcards.length}
          </p>
          <button
            onClick={() => { shuffleFlashcards(); setQuizState("fillBlanks"); }}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-10 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            Shuffle & Restart
          </button>
          <button
            onClick={() => setOnFirstPage(true)}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-6 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            Go to Decks
          </button>
          <button
            onClick={handleStartNewQuiz}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-6 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        // Regular quiz UI before it's finished
        <div className="flex flex-col items-center">
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="w-[800px] h-[400px] -mt-[17rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            <h2 className="text-3xl font-semibold text-[#354F52] break-words max-w-full p-5">
              {currentFlashcard ? (showAnswer ? currentFlashcard.answer : currentFlashcard.question) : "Loading..."}
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-[600px] mt-5">
            <button
              onClick={handlePreviousFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-175 active:scale-50 mt-[2rem]"
              disabled={currentIndex === 0}
            >
              <CircleArrowLeft className="w-10 h-10 text-[#354F52]" />
            </button>
            <div className="bg-[#354F52] rounded-lg p-2 mt-[2rem]">
              <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl text-white font-medium mt-[2.5rem]">
                {currentIndex + 1} / {tempFlashcards.length}
              </span>
            </div>
            <button
              onClick={handleNextFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-175 active:scale-50 mt-[2rem]"
            >
              <CircleArrowRight className="w-10 h-10 text-[#354F52]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};