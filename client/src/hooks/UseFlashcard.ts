import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Deck, Flashcard } from "../types/FlashCardTypes";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const token = localStorage.getItem("token");
//main flashcard hooks
export const useFlashcardHooks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [onFirstPage, setOnFirstPage] = useState<boolean>(true);
  const [deckTitle, setDeckTitle] = useState<string>("");
  const [deckId, setDeckId] = useState<string | null>(null);

  const [loadCards, setLoadCards] = useState<boolean>(false);
  const [loadDecks, setLoadDecks] = useState<boolean>(false);

  // Fetch decks and flashcards on mount
  const fetchDecks = async () => {
    setLoadDecks(true)
    try {
      if (!token) throw new Error("No token found");

      const response = await axios.get(`http://localhost:3002/cards/getDecks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
        deck_id: deck.deck_id,
        title: deck.title,
      }));
      setDecks(deckData);
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setLoadDecks(false)
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  // Watch for deckId changes
  useEffect(() => {
    if (deckId) console.log(`Updated deckId: ${deckId}`);
  }, [deckId]);

  const saveDeck = async () => {
    if (!deckTitle.trim()) {
      alert("Deck title cannot be empty.");
      return;
    }

    try {
      setOnFirstPage(true);
      const data: Deck = { title: deckTitle, deck_id: uuidv4() };

      await axios.post(`http://localhost:3002/cards/insertDecks`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeckTitle("");
     toast.success("Deck created successfully!");

    } catch (error) {
      console.error("Error saving deck:", error);
    }
  };

  const loadDeck = async (deck_id: string) => {
    setLoadCards(true)
    try {
      setDeckId(deck_id);
      setIsReviewing(false);
      setOnFirstPage(false);

      const response = await axios.get(`http://localhost:3002/cards/getFlashcards`, {
        params: { deck_id },
      });

      const flashcardData = response.data.map((flashcard: {
        question: string;
        answer: string;
        flashcard_id: string;
        unique_flashcard_id: string;
      }) => ({
        question: flashcard.question,
        answer: flashcard.answer,
        flashcard_id: flashcard.flashcard_id,
        unique_flashcard_id: flashcard.unique_flashcard_id,
      }));

      setFlashcards(flashcardData);
    } catch (error) {
      console.error("Error loading deck:", error);
      setFlashcards([]);
    } finally {
      setLoadCards(false)
    }
  };

  const deleteDeck = async (deckId: string) => {
    try {
      await axios.delete(`http://localhost:3002/cards/deleteDeck/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDecks(decks.filter((deck) => deck.deck_id !== deckId));
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const deleteFlashcard = async (unique_flashcard_id: string) => {
    try {
      await axios.delete(`http://localhost:3002/cards/deleteFlashcard/${unique_flashcard_id}`);
      setFlashcards(flashcards.filter((flashcard) => flashcard.unique_flashcard_id !== unique_flashcard_id));
      console.log("Flashcard deleted successfully!");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };
  const openEditModal = (deck_id: string) => {
    setDeckId(deck_id);  // Set the deckId when editing
    setDeckTitle(decks.find(deck => deck.deck_id === deck_id)?.title || ""); // Set the current title
    setIsEditModalOpen(true);
  };

  const handleUpdateDeckTitle = async () => {
    if (!deckTitle || deckTitle.trim() === "") {
      toast.warn("Please enter a valid title.");
      return;
    }
  
    if (!deckId) {
      toast.warn("No deck selected for update.");
      return;
    }
  
    try {
      const updateResponse = await axios.put(
        `http://localhost:3002/cards/updateDeckTitle/${deckId}`,
        { title: deckTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (updateResponse.status === 200) {
        const response = await axios.get(`http://localhost:3002/cards/getDecks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
          deck_id: deck.deck_id,
          title: deck.title,
        }));
  
        setDecks(deckData);
        setIsEditModalOpen(false); // Close the modal after success
        toast.success("Deck title updated successfully!");
      } else {
        toast.error("Failed to update deck title");
      }
    } catch (error) {
      console.error("Error updating deck title:", error);
      toast.error("An error occurred while updating the deck title.");
    }
  };
  

  const updateFlashcard = async (flashcardId: string, newValue: string, field: "question" | "answer") => {
    try {
      const data: { question?: string; answer?: string } = {};
      data[field] = newValue; // Dynamically set the field being updated
  
      const response = await axios.put(
        `http://localhost:3002/cards/updateFlashcard/${flashcardId}`,
        data
      );
      console.log(`${field} updated successfully!`, response.data);
    } catch (error) {
      console.error("Error updating flashcard:", error|| error);
      alert("Failed to update the flashcard. Please try again later.");
    }
  };
  

  return {
    loadDecks,
    loadCards,
    flashcards,
    decks,
    isReviewing,
    onFirstPage,
    deckTitle,
    deckId,
    isModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    setIsModalOpen,
    setDecks,
    setFlashcards,
    setDeckTitle,
    setDeckId,
    setIsReviewing,
    setOnFirstPage,
    saveDeck,
    loadDeck,
    deleteDeck,
    deleteFlashcard,
    updateFlashcard,
    fetchDecks,
    openEditModal,
    handleUpdateDeckTitle

  };
};

// quiz flashcard hooks

const correctSound = new URL("../../assets/soundEffects/correct_sound.mp3", import.meta.url).href;
const incorrectSound = new URL("../../assets/soundEffects/incorrect_sound.mp3", import.meta.url).href;

export const useQuizState = (flashcards: Flashcard[], setTempFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>, setOnFirstPage: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizState, setQuizState] = useState<"review" | "fillBlanks" | "finished">("review");
  const [userScore, setUserScore] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "incorrect" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);

  useEffect(() => {
    if (flashcards?.length) {
      setTempFlashcards(shuffleArray(flashcards));
    }
  }, [flashcards]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const resetFlashcardState = () => {
    setShowAnswer(false);
    setUserInput("");
    setAnswerStatus(null);
    setAttempts(3);
  };

  const handleNextFlashcard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetFlashcardState();
    } else {
      setQuizState("finished");
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetFlashcardState();
    }
  };

  const handleCheckAnswer = async () => {
    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = flashcards[currentIndex]?.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      toast.success("Correct answer! Well done!");
      correctAudio.play();
      setUserScore((prev) => prev + 1);
      setAnswerStatus("correct");
      await updateProgress(flashcards[currentIndex].unique_flashcard_id);
      handleNextFlashcard();
    } else {
      setAttempts((prev) => prev - 1);
      setAnswerStatus("incorrect");
      incorrectAudio.play();

      if (attempts <= 1) {
        toast.error("No more attempts left. Moving to the next question.");
        handleNextFlashcard();
      } else {
        toast.warn(`Incorrect answer. ${attempts - 1} ${attempts - 1 === 1 ? 'attempt' : 'attempts'} left.`);
      }
    }
    setUserInput("");
  };

  const updateProgress = async (uniqueFlashcardId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `http://localhost:3002/cards/updateFlashcardProgress/${uniqueFlashcardId}`,
        { progress: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status !== 200) {
        console.error("Unexpected response status", response.status);
      }
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  return {
    currentIndex,
    userInput,
    showAnswer,
    quizState,
    userScore,
    attempts,
    answerStatus,
    inputRef,
    handleNextFlashcard,
    handlePreviousFlashcard,
    handleCheckAnswer,
    resetFlashcardState,
    setShowAnswer,
    setQuizState,
    setOnFirstPage,
    setCurrentIndex,
    setUserInput,
    setUserScore,
    setAttempts,
    setAnswerStatus,
  };
};

export const useFlashcardUtils = () => {
  const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([]);

  const shuffleFlashcards = (flashcards: Flashcard[]) => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setTempFlashcards(shuffled);
  };

  return { tempFlashcards, shuffleFlashcards, setTempFlashcards };
};