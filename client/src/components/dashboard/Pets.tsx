import { useState, useEffect } from "react";
import { usePets } from "../../hooks/usePets"; // Import your custom hook for fetching pets
import PetSelectionModal from "./PetSelectionModal";
import axios from "axios";
const token = localStorage.getItem("token");

interface PetsProps {
  onPetAdded: (pet: any) => void;
  onPetUpdated: (updatedPet: any) => void;
}

const Pets: React.FC<PetsProps> = ({ onPetAdded, onPetUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCongratulatoryMessage, setShowCongratulatoryMessage] = useState("");
  const { pets, loading, error, fetchPets } = usePets(); // Use your hook to fetch pets

  // Fetch the pet data once the user is authenticated (after the initial render)
  useEffect(() => {
    fetchPets();
  }, []); // Ensure the fetchPets function is only called once during the component mount

  const handleClaimPet = () => {
    setShowModal(true);
  };

  const handleFeedPet = async (petData: any) => {
    if (petData.pet_currency >= 100) {
      const updatedPet = { ...petData };
  
      if (updatedPet.pet_evolution_rank >= 3) {
        alert("Your pet has reached its final evolution rank! It cannot be fed anymore.");
        return;
      }
  
      if (updatedPet.pet_progress_bar >= 100) {
        updatedPet.pet_progress_bar = 0; // Reset the progress bar
        updatedPet.pet_evolution_rank += 1; // Increase evolution rank
        updatedPet.pet_max_value = updatedPet.pet_evolution_rank === 3 ? 200 : 150;
  
        setShowCongratulatoryMessage("Congratulations! Your pet has evolved!");
        setTimeout(() => {
          setShowCongratulatoryMessage("");
        }, 3000);
      } else {
        updatedPet.pet_currency -= 100; // Deduct 100 currency
        updatedPet.pet_progress_bar = Math.min(updatedPet.pet_progress_bar + 10, 100); // Add 10 progress
      }
      console.log(updatedPet)
      const response = await axios.patch(
        `http://localhost:3002/pets/updatePet/${updatedPet.pet_id}`,
        {
          pet_currency: updatedPet.pet_currency,
          pet_progress_bar: updatedPet.pet_progress_bar, 
          updated_date: new Date()// Update progress bar as well
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
        onPetUpdated(updatedPet); // Update pet data with new progress and currency

    } else {
      alert("Not enough currency to feed the pet.");
    }
  };

  const handleAddCash = async (petData: any) => {
    const updatedPet = { ...petData, pet_currency: petData.pet_currency + 500 };

    const response = await axios.post("http://localhost:3002/pets/updatePet", updatedPet);
    if (response.status === 200) {
      onPetUpdated(updatedPet); // Update the pet data after successful API call
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Assuming pets is an array and each pet is displayed
  const petData = pets.length > 0 ? pets[0] : null; // Just for simplicity, assume the first pet is being used

  return (
    <div className="bg-primary-300 w-full h-full rounded-xl flex flex-col bg-cover bg-center">
      {petData ? (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold ml-4 mt-4">Pets</h1>
            <div className="w-28 h-8 bg-shades-light rounded-xl ml-auto mr-5 mt-5 flex justify-center items-center text-lg font-semibold">
              {petData.pet_currency}
            </div>
          </div>
          <div className="flex justify-center">
            <h2>{petData.pet_name}</h2>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={`src/assets/${petData.pet_type}_final.gif`}
              alt="Pet"
              className="w-10 h-64 md:w-96 md:h-96 object-contain transition-all duration-500"
            />
            <div className="w-64 md:w-96">
              <progress
                id="progressBar"
                value={petData.pet_progress_bar}
                max={100}
                className="w-full h-3 bg-black rounded-md"
              />
            </div>
            <div className="w-full md:w-96">
              <h2 className="font-semibold text-sm mb-1 text-[#354F52]">Pet Info</h2>
              <p className="text-sm text-[#354F52]">{petData.pet_type}</p>
              <p className="text-sm text-[#354F52]">Evolution Rank: {petData.pet_evolution_rank}</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              className="bg-green-500 w-40 h-8 text-white rounded-xl"
              onClick={() => handleFeedPet(petData)}
            >
              Feed Pet
            </button>
            <button
              className="bg-blue-500 w-40 h-8 text-white rounded-xl"
              onClick={() => handleAddCash(petData)}
            >
              Add Cash
            </button>
          </div>

          {showCongratulatoryMessage && (
            <div className="mt-4 text-center text-xl font-bold text-green-500">
              {showCongratulatoryMessage}
            </div>
          )}
        </>
      ) : (
        <button
          className="bg-primary-dark py-2 px-4 text-white rounded-xl"
          onClick={handleClaimPet}
        >
          Claim a Pet
        </button>
      )}

      {showModal && (
        <PetSelectionModal onClose={() => setShowModal(false)} onPetAdded={onPetAdded} />
      )}
    </div>
  );
};

export default Pets;
