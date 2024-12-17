import axios from "axios";
import { useEffect, useState } from "react";

interface ProgressItem {
    title: string;
    time: string;
    progress: number; // Progress value (0 to 100)
  }

const DeckProgress: React.FC = () => {
    const [progress, setProgress] = useState<number>(0);
    const [progressItems, setProgressItems] = useState<ProgressItem[]>([])
    const token = localStorage.getItem('token');

    const fetchFlashcardsForDeck = async (deck_id: string) => {
        try {
        const response = await axios.get(`http://localhost:3002/cards/getFlashcards`, {
                params: { deck_id },
        });

        // Process the flashcards data (you can calculate progress based on the flashcards)
        const flashcards = response.data;
        return flashcards
        } catch (error) {
        console.error("Error fetching flashcards:", error);
        }
    };


    const fetchDecks = async () => {
        try {
          const response = await axios.get('http://localhost:3002/cards/getDecks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const decks = response.data;
    
          // Map through the decks and fetch flashcards for each deck
          const deckPromises = decks.map(async (deck: { title: string, deck_id: string }) => {
            const flashcards = await fetchFlashcardsForDeck(deck.deck_id);
    
            // Count the total flashcards and the completed ones
            const totalFlashcards = flashcards.length;
            const completedFlashcards = flashcards.filter((flashcard: any) => flashcard.progress === true).length;
            
            // Calculate the progress percentage
            const progress = totalFlashcards > 0 ? (completedFlashcards / totalFlashcards) * 100 : 0;
    
            // Get the current time (for the time field)
            const time = new Date().toLocaleTimeString();
    
            return {
              title: deck.title,
              time: time,
              progress: Math.round(progress), // Round the progress to the nearest integer
            };
          });
          
          // Wait for all deck data to be fetched
          const deckTitles = await Promise.all(deckPromises);

          let totalFlashcards = 0;
          let completedFlashcards = 0;

          for (const deck of decks) {
            const flashcards = await fetchFlashcardsForDeck(deck.deck_id);
            totalFlashcards += flashcards.length;
            completedFlashcards += flashcards.filter((flashcard: any) => flashcard.progress === true).length;
          }
          const overallProgress = totalFlashcards > 0 ? (completedFlashcards / totalFlashcards) * 100 : 0;
          console.log(overallProgress)

         setProgress(Math.round(overallProgress)); 
    
          setProgressItems(deckTitles); 
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      };

  useEffect(() => {
    fetchDecks();   
  }, []);

  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="rounded-lg p-4 w-full max-w">
      {/* Progress Header */}
      <h2 className="text-xl font-bold mb-4">Progress</h2>

      {/* Circular Progress */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e63946"
              strokeWidth="10"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset} 
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-xl font-bold text-[#e63946]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Progress List with Individual Progress Bars */}
      <div className="space-y-4">
        {progressItems.map((item, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-3 mt-[-8.4rem] ml-[7rem] scale-95 w-[25rem]">
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-sm font-bold">{item.title}</h3>
              </div>

              <span className="text-xs text-gray-400">{item.time}</span>
            </div>

            <div className="w-full mt-2">
              <div className="h-2 bg-gray-300 rounded-full">
                <div
                  className="h-2 bg-[#e63946] rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs mt-1 text-gray-500">{item.progress}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckProgress