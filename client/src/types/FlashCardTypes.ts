export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface CreateFlashcardProps {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  flashCardId: string | null; // Add this to pass the deck ID dynamically
}

// Structure of a saved deck, including the `id` and `flashcards` it contains
export type Deck = {
  deck_id: string;
  title: string;
};


export type SaveDeckResponse = {
  success: boolean;
  message: string;
};


export type DeleteFlashcardResponse = {
  success: boolean;
  message: string;
};

export interface quizFlashcardProps {
  setOnFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  flashcards: Flashcard[];
}


