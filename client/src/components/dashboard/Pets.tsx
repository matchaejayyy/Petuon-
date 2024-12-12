import { useState, useEffect } from "react";
import { supabase } from "../../SupabaseClient"; // Import Supabase client
import PetSelectionModal from "./PetSelectionModal";

interface PetsProps {
  petData: any;
  onPetAdded: (pet: any) => void;
  onPetUpdated: (updatedPet: any) => void;
}

const Pets: React.FC<PetsProps> = ({ petData, onPetAdded, onPetUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCongratulatoryMessage, setShowCongratulatoryMessage] = useState("");

  // Fetch pet data from Supabase on initial render
  useEffect(() => {
    const fetchPetData = async () => {
      const { data, error } = await supabase
        .from('pets') // Assuming your table is named 'pets'
        .select('*')
        .eq('pet_id', petData.pet_id); // Adjust the query as per your table structure

      if (error) {
        console.error('Error fetching pet data:', error.message);
      } else if (data) {
        onPetUpdated(data[0]);
      }
    };

    if (petData?.pet_id) {
      fetchPetData();
    }
  }, [petData?.pet_id, onPetUpdated]);

  const handleClaimPet = () => {
    setShowModal(true);
  };

  const handleFeedPet = async () => {
    if (petData.pet_currency >= 100) {
      let updatedPet = { ...petData };

      if (updatedPet.pet_evolution_rank >= 3) {
        alert("Your pet has reached its final evolution rank! It cannot be fed anymore.");
        return;
      }

      if (updatedPet.pet_progress_bar >= 100) {
        updatedPet.pet_progress_bar = 0;
        updatedPet.pet_evolution_rank += 1;

        if (updatedPet.pet_evolution_rank === 3) {
          updatedPet.pet_max_value = Math.min(updatedPet.pet_max_value + 100, 200);
          setShowCongratulatoryMessage("Congratulations! Your pet has reached its final evolution!");
        } else {
          updatedPet.pet_max_value = Math.min(updatedPet.pet_max_value + 50, 150);
          setShowCongratulatoryMessage("Congratulations! Your pet has evolved!");
        }

        setTimeout(() => {
          setShowCongratulatoryMessage("");
        }, 3000);
      } else {
        updatedPet.pet_currency -= 100;
        updatedPet.pet_progress_bar = Math.min(updatedPet.pet_progress_bar + 10, 100);
      }

      // Update pet in Supabase
      const { error } = await supabase
        .from('pets')
        .update(updatedPet)
        .eq('pet_id', updatedPet.pet_id);

      if (error) {
        console.error('Error updating pet data:', error.message);
      }

      onPetUpdated(updatedPet);
    } else {
      alert("Not enough currency to feed the pet.");
    }
  };

  const handleAddCash = async () => {
    const updatedPet = {
      ...petData,
      pet_currency: petData.pet_currency + 500,
    };

    // Update pet currency in Supabase
    const { error } = await supabase
      .from('pets')
      .update({ pet_currency: updatedPet.pet_currency })
      .eq('pet_id', updatedPet.pet_id);

    if (error) {
      console.error('Error updating pet data:', error.message);
    }

    onPetUpdated(updatedPet);
  };

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
              onClick={handleFeedPet}
            >
              Feed Pet
            </button>
            <button
              className="bg-blue-500 w-40 h-8 text-white rounded-xl"
              onClick={handleAddCash}
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
