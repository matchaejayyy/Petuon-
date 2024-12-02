import React, { useState,} from 'react';
import { Flashcard, CreateFlashcardProps} from "../../types/FlashCardTypes";
import { ListPlus } from 'lucide-react';
// import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

 
  export  const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ flashcards, setFlashcards }) => {
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

  const createFlashcard = async () => {

    if (question && answer) {
      const newFlashcard: Flashcard = { question, answer };
      console.log(newFlashcard);
      try {
        const response = await axios.post(`http://localhost:3002/flashcards/insertCards`, newFlashcard);
        if (response.status === 201) {
          setFlashcards([...flashcards, newFlashcard]);
          setQuestion('');
          setAnswer('');
          setFlashcardCreated(true);
        } else {
          setFlashcardCreated(false);
        }
      } catch (error) {
        console.error('Error creating flashcard:', error);
        setFlashcardCreated(false);
      }
    } else {
      setFlashcardCreated(false);
    }
  };



  return (
    <div className="mt-[-2rem] flex flex-col md:flex-row justify-center items-center gap-10 p-4 ">
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        style={{ fontFamily: '"Signika Negative", sans-serif' }} 
        className="h-16 rounded-3xl w-full md:w-1/3 p-5 shadow-xl border-2 border-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent placeholder-gray-300 text-white bg-[#657F83] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
        placeholder="Insert question"
      />
      <input
        type="text"
        value={answer}
        onChange={handleAnswerChange}
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="h-16 rounded-3xl w-full md:w-1/3 p-5 shadow-xl border-2 border-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent placeholder-gray-300 text-white bg-[#657F83] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
        placeholder="Insert answer"
      />
      <button
        onClick={createFlashcard}
        className="bg-[#657F83] text-white font-semibold h-16 w-16 shadow-xl rounded-full hover:bg-[#52796F] transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center transform hover:scale-110"
      >
        <ListPlus className="w-10 h-10 ml-2" />
      </button>
    </div>


  );
};

