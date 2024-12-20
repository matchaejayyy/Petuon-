import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for navigation
import { FilePenLine, Minus } from "lucide-react"; // Icons for edit/delete

interface CarouselProps {
    flashcards: { id: string; title: string }[];
    loadFlashcard: (id: string) => void;
    deleteFlashcard: (id: string) => void;
    setIsEditModalOpen: (isOpen: boolean) => void;
    setFlashcardId: (id: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({ flashcards, loadFlashcard, deleteFlashcard, setIsEditModalOpen, setFlashcardId }) => {
    const [currentIndex, setCurrentIndex] = useState(0); // Tracks the starting index of visible flashcards
    const visibleFlashcardsCount = 3; // Number of flashcards visible at a time

    // Validate props
    if (!Array.isArray(flashcards)) {
        console.error("The 'flashcards' prop must be an array.");
        return null; // Return nothing if 'flashcards' is not an array
    }

    // Move to the previous set of flashcards
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? flashcards.length - visibleFlashcardsCount : prevIndex - 1
        );
    };

    // Move to the next set of flashcards
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + visibleFlashcardsCount >= flashcards.length ? 0 : prevIndex + 1
        );
    };

    // Function to get the flashcards currently visible
    const getVisibleFlashcards = () => {
        const endIndex = currentIndex + visibleFlashcardsCount;
        if (endIndex <= flashcards.length) {
            return flashcards.slice(currentIndex, endIndex);
        } else {
            // Wrap around to show the remaining flashcards
            return [...flashcards.slice(currentIndex), ...flashcards.slice(0, endIndex - flashcards.length)];
        }
    };

    // Handle "Select" button: Select the middle flashcard
    const handleSelect = () => {
        const middleIndex = Math.floor(visibleFlashcardsCount / 2);
        const selectedFlashcard = getVisibleFlashcards()[middleIndex];
        console.log("Selected Flashcard:", selectedFlashcard);
        loadFlashcard(selectedFlashcard.id);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center mt-10 space-y-6">
            {/* Carousel Container */}
            <div className="relative w-full flex items-center justify-center">
                {/* Left Navigation Button */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-700 hover:text-gray-900"
                >
                    <ChevronLeft size={50} />
                </button>

                {/* Visible Flashcards */}
                <ul className="flex items-center justify-center space-x-6">
                    {getVisibleFlashcards().map((flashcard, index) => {
                        const assignedColor =
                            index === Math.floor(visibleFlashcardsCount / 2) ? "bg-[#4F6F72]" : "bg-gray-300"; // Highlight middle flashcard

                        return (
                            <li key={flashcard.id} className="w-[200px] flex-shrink-0">
                                <div
                                    onClick={() => loadFlashcard(flashcard.id)}
                                    className={`shadow-xl rounded-3xl w-[200px] h-[260px] cursor-pointer transition-transform transform hover:scale-105 relative bg-white`}
                                >
                                    {/* Top Section */}
                                    <div className={`h-[35%] rounded-t-3xl ${assignedColor}`}></div>

                                    {/* Edit/Delete Buttons */}
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <button
                                            className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditModalOpen(true);
                                                setFlashcardId(flashcard.id);
                                            }}
                                        >
                                            <FilePenLine className="w-5 h-5 text-gray-700" />
                                        </button>

                                        <button
                                            className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteFlashcard(flashcard.id);
                                            }}
                                        >
                                            <Minus className="w-5 h-5 text-red-700" />
                                        </button>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="h-[65%] flex flex-col justify-center items-center">
                                        <h1
                                            className="text-xl font-bold text-[#354F52] text-center uppercase"
                                            style={{ fontFamily: '"Signika Negative", sans-serif' }}
                                        >
                                            {flashcard.title}
                                        </h1>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Right Navigation Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-700 hover:text-gray-900"
                >
                    <ChevronRight size={50} />
                </button>
            </div>

            {/* Select Button */}
            <button
                onClick={handleSelect}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition"
            >
                SELECT
            </button>

            {/* Create Flashcard Button */}
            <button className="px-6 py-2 bg-[#4F6F72] text-white rounded-full shadow-md hover:bg-[#3E5A5D] transition">
                Create Flashcard
            </button>
        </div>
    );
};

export default Carousel;