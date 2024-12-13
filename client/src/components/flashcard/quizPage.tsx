import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { quizFlashcardProps, Flashcard } from "../../types/FlashCardTypes";
import { useState, useEffect, useRef } from "react";

const correctSound = new URL('../../assets/soundEffects/correct_sound.mp3', import.meta.url).href;
const incorrectSound = new URL('../../assets/soundEffects/incorrect_sound.mp3', import.meta.url).href

export const QuizFlashcard: React.FC<quizFlashcardProps> = ({ setOnFirstPage, flashcards }) => {
  const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentFlashcard = tempFlashcards[currentIndex];

  // Create Audio objects using resolved paths
  const CorrectSound = new Audio(correctSound);
  const IncorrectSound = new Audio(incorrectSound);


  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setTempFlashcards(shuffleArray(flashcards));
    }
  }, [flashcards]);

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
    setQuizFinished(false);
  };

  const handleNextFlashcard = () => {
    if (currentIndex < tempFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleStartNewQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentIndex(0);
  };

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

  const isQuizComplete = currentIndex === tempFlashcards.length - 1 && quizFinished;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (currentFlashcard && document.querySelector('input')?.value.trim().toLowerCase() === currentFlashcard.answer.trim().toLowerCase()) {
          handleNextFlashcard();
          const clearTextBox = () => {
            const inputElement = document.querySelector('input');
            if (inputElement) {
              inputElement.value = '';
            }
          };
          clearTextBox();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentFlashcard, currentIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {quizStarted ? (
        // Fill-in-the-blank quiz UI
        <div className="flex flex-col items-center">
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="w-[800px] h-[400px] -mt-[17rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center"
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
            <input
              type="text"
              placeholder="Your answer"
              ref={inputRef}
              style={{ fontFamily: '"Signika Negative", sans-serif' }} className={`p-2 border rounded-md transition-all duration-300 focus:outline-none 
                ${answerStatus === 'correct' 
                  ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500 border-green-500 bg-green-50' 
                  : answerStatus === 'incorrect' 
                    ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500 bg-red-50 shake' 
                    : 'focus:ring-2 focus:ring-[#354F52] focus:border-transparent border-[#354F52]'}`}
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
            <button
              onClick={handleSubmit}
              style={{ fontFamily: '"Signika Negative", sans-serif' }} className="p-2 bg-[#354F52] text-white rounded-md transition-all hover:bg-[#456B65]"
            >
              Submit
            </button>
          </div>
            {isQuizComplete && (
              <div className="flex flex-col items-center mt-5">
                <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-5xl text-[#354F52] font-bold mb-4 -mt-[16rem]">
                Congratulations! You've completed the quiz
          </h2>
          <button
            onClick={shuffleFlashcards}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-10 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
             Start Quiz Again
          </button>
          <button
            onClick={() => setOnFirstPage(true)}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-6 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            Go to Decks
          </button>
          </div>
            )}

          {/* Navigation Controls */}
            {!quizStarted && (
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
            )}
        </div>
      ) : isQuizComplete ? (
        <div className="flex flex-col items-center">
          {/* Quiz Completion UI */}
          <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-5xl text-[#354F52] font-bold mb-4 -mt-[16rem]">
            FlashCard Complete! Well Done!
          </h2>
          <button
            onClick={shuffleFlashcards}
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
            className="w-[800px] h-[400px] -mt-[17rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center cursor-pointer"
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
