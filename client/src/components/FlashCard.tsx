import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"
import React, { useState } from 'react';

type Flashcard = {
    question: string;
    answer: string;
  };
  
  function FlashcardComponent() {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [flashcardCreated, setFlashcardCreated] = useState<boolean>(false);
  
    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuestion(event.target.value);
      setFlashcardCreated(false);
      console.log(question)
    };
  
    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAnswer(event.target.value);
      setFlashcardCreated(false);
      console.log(answer)
    };
  
    const createFlashcard = () => {
      if (question && answer) {
        setFlashcardCreated(true);
        const newFlashcard: Flashcard = { question, answer };
        setFlashcards([...flashcards, newFlashcard]);
        setQuestion(''); 
        setAnswer('');   
      } else {
        setFlashcardCreated(false);
      }
    };
  
    const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
        return (
          <ul className=" w-screen h-[70vh] flex flex-col items-center overflow-y-auto">
            {flashcards.map((flashcard, index) => (
              <li key={index} className="w-2/3 m-3">
                <div className="bg-orange-100 rounded-2xl h-52 w-full m-5 flex flex-col items-center justify-center overflow-auto">
                  <h1 className="text-5xl mb-5 break-words">{flashcard.question}</h1>
                  <h2 className="text-xl">{flashcard.answer}</h2>
                </div>
              </li>
            ))}
          </ul>
        );
      };
       
  
    return (
      <>
        <div className="flex">
            <h1 className="text-5xl m-10">Create Flashcards!</h1> 
            <div className="flex justify-center items-center">
                <button className="bg-lime-700 h-16 w-36 rounded-full">Save</button>
            </div>
    
        </div>
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
          <button onClick={createFlashcard}
          className="bg-lime-700 h-16 w-36 rounded-full  "
          >
            <p>Create</p>
            
          </button>
          {flashcardCreated}
        </div>
  
        <div>
          <FlashcardList flashcards={flashcards} />
        </div>
      </>
    );
  }
  

const FlashCard = () => {
    return (
        <>
            <WhiteContainer>
                <FlashcardComponent/>
            </WhiteContainer>        
            <SideBar/>
        </>
    )
}

export default FlashCard