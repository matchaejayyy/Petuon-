import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { quizFlashcardProps, Flashcard } from "../../types/FlashCardTypes";


import axios from "axios";

const token = localStorage.getItem('token');

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const correctSound = new URL('../../assets/soundEffects/correct_sound.mp3', import.meta.url).href;
const incorrectSound = new URL('../../assets/soundEffects/incorrect_sound.mp3', import.meta.url).href


export const QuizFlashcard: React.FC<quizFlashcardProps> = ({ setOnFirstPage, flashcards }) => {
  const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("")
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [quizState, setQuizState] = useState<"review" | "fillBlanks" | "finished">("review")
  const [userScore, setUserScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(3);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentflashcard = tempFlashcards[currentIndex];

   // Create Audio objects using resolved paths
   const CorrectSound = new Audio(correctSound);
   const IncorrectSound = new Audio(incorrectSound);

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
      setUserScore((prevScore) => prevScore + 1); // Increment user score
  
      // Update the progress if the answer is correct
      await updateProgress(tempFlashcards[currentIndex].unique_flashcard_id);

      if (currentIndex === tempFlashcards.length - 1) {
        setQuizState("finished"); // End quiz if it's the last question
      } else {
        setAttempts(3); // Reset attempts for the next question
        handleNextFlashcard();
      }
    } else if (attempts > 1) {
      toast.error("Incorrect answer, please try again.");
      setAttempts((prevAttempts) => prevAttempts - 1); // Decrement attempts
    } else {
      toast.error("No more attempts left. Moving to the next question.");
  
      if (currentIndex === tempFlashcards.length - 1) {
        setQuizState("finished"); // End quiz if it's the last question
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
  
  const updateProgress = async (unique_flashcard_id: string) => {
    try {
      if (!token) throw new Error("No token found");
      const response = await axios.put(`http://localhost:3002/cards/updateFlashcardProgress/${unique_flashcard_id}`,
        { progress: true }, // Body payload, assuming `progress` is boolean
        {
          headers: { Authorization: `Bearer ${token}` },
        });
  
      if (response.status === 200) {
        console.log("Progress updated successfully:", response.data);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to update progress:", error.response?.data?.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
};
  


  const currentFlashcard = tempFlashcards[currentIndex];
  const isQuizComplete =
  currentIndex === tempFlashcards.length - 1 && quizState === "finished" &&
  (showAnswer);

  const handleSubmit = () => {
    const inputElement = inputRef.current;
  
    // Check if input and flashcard data are valid
    if (currentFlashcard && inputElement) {
      const userAnswer = inputElement.value.trim().toLowerCase();
      const correctAnswer = currentFlashcard.answer.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
  
       // Update answer status
      setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

      // Play sound based on the answer status
      if (isCorrect) {
        CorrectSound.play().catch(err => console.error('Error playing correct sound:', err));
      } else {
        IncorrectSound.play().catch(err => console.error('Error playing incorrect sound:', err));
      }
  
      setTimeout(() => {
        if (isCorrect) {
          handleNextFlashcard();
        }
        inputElement.value = '';
        setAnswerStatus(null);
      }, 500);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {quizState === "fillBlanks" ? (
        // Fill-in-the-blank quiz UI
        <div className="flex flex-col items-center">
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="w-[800px] h-[400px] -mt-[27rem] bg-white rounded-xl shadow-xl flex  items-center justify-center text-center  cursor-pointer"
          >
            <h2 className="text-3xl font-semibold text-[#354F52] break-words max-w-full p-5">
              {currentFlashcard ? `Fill in the blank: ${currentFlashcard.question.replace(
                /___/g,
                "_____"
              )}` : "Loading..."}
            </h2>
          </div>

           {/* Input for fill-in-the-blank */}
           <div className="mt-5 flex items-center space-x-2">
          <style>
            {`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
              }
              .animate-shake {
                animation: shake 0.3s ease-in-out;
              }
            `}
          </style>
          <div
            className={`transition-transform ${
              answerStatus === 'incorrect' ? 'animate-shake' : ''
            }`}
          >
            <input
              type="text"
              placeholder="Your answer"
              ref={inputRef}
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className={`p-2 border rounded-md transition-all duration-300 focus:outline-none 
                ${
                  answerStatus === 'correct'
                    ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500 border-green-500 bg-green-50'
                    : answerStatus === 'incorrect'
                    ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500 bg-red-50'
                    : 'focus:ring-2 focus:ring-[#354F52] focus:border-transparent border-[#354F52]'
                }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(); // Trigger submission when pressing "Enter"
                }
              }}
              onChange={() => {
                // Reset answer status when typing
                setAnswerStatus(null);
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="p-2 bg-[#354F52] text-white rounded-md transition-all hover:bg-[#456B65]"
          >
            Submit
          </button>
        </div>

    {/* Navigation Controls */}
          <div className="flex items-center justify-between w-auto mt-5">
            <div className="bg-[#354F52] rounded-lg p-2 mt-[0.5rem]">
              <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl text-white font-medium mt-[2.5rem]">
                {currentIndex + 1} / {tempFlashcards.length}
              </span>
            </div>
          </div>
        </div>

      ) : isQuizComplete ? (
        <div className="flex flex-col items-center">
          {/* Quiz Completion UI */}
          <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-5xl text-[#354F52] font-bold mb-4 -mt-[25rem]">
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
            className="w-[800px] h-[400px] -mt-[29rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center cursor-pointer"
            style={{
              fontFamily: '"Signika Negative", sans-serif',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            {!showAnswer && (
              <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 text-lg">
                Tap to Reveal
              </div>
            )}
            <h2
              className="text-3xl font-semibold text-[#354F52] break-words max-w-full p-5"
              style={{
              fontFamily: '"Signika Negative", sans-serif',
              backfaceVisibility: 'hidden',
              transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {currentFlashcard ? (showAnswer ? currentFlashcard.answer : currentFlashcard.question) : "Loading..."}
            </h2>
          </div>

           {/* Navigation Controls */}
           <div className="flex items-center justify-between w-[600px] mt-5">
            <button
              onClick={handlePreviousFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-175 active:scale-50 mt-[1rem]"
              disabled={currentIndex === 0}
            >
              <CircleArrowLeft className="w-10 h-10 text-[#354F52]" />
            </button>
            <div className="bg-[#354F52] rounded-lg p-2 mt-[1.5rem]">
              <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl text-white font-medium mt-[2.5rem]">
                {currentIndex + 1} / {tempFlashcards.length}
              </span>
            </div>
            <button
              onClick={handleNextFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-200 active:scale-50 mt-[1rem]"
            >
              <CircleArrowRight className="w-10 h-10 text-[#354F52]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};