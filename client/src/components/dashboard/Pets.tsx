import { useEffect, useState } from "react";
import axios from 'axios';

const Pets = () => {
    const [currency, setCurrency] = useState(1000);
    const [progress, setProgress] = useState(0);
    const [petName, setPetName] = useState('Carmine')

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/getPets');
                const pet = response.data[0]; // Assuming you only have one pet for now
                setPetName(pet.pet_name);
                setCurrency(pet.pet_currency);
                setProgress(pet.pet_progress_bar);
            } catch (error) {
                console.error('Error fetching pet data:', error);
            }
        };

        fetchPetData();
    }, []);

    const updatePetData = async (newCurrency: number, newProgress: number) => {
        try {
            await axios.put('http://localhost:3002/updatePet', {
                pet_id: 1, // Replace with the actual pet_id
                pet_currency: newCurrency,
                pet_progress_bar: newProgress,
            });
        } catch (error) {
            console.error('Error updating pet data:', error);
        }
    };

    const feedPetClick = () => {
        if (currency >= 100) {
            if (progress < 100) {
                const newCurrency = currency - 100;
                const newProgress = progress + 5;
                setCurrency(newCurrency);
                setProgress(newProgress);
                updatePetData(newCurrency, newProgress);
                console.log("pet has been fed");
            } else {
                console.log("Pet already reached final evolution");
            }
        } else {
            console.log("You don't have enough money to feed your pet");
        }
    };

    const addCash = () => {
        const newCurrency = currency + 100;
        setCurrency(newCurrency);
        updatePetData(newCurrency, progress);
    }

    const decreaseProgress = () => {
        if (progress > 0) {
            const newProgress = progress - 5;
            setProgress(newProgress);
            updatePetData(currency, newProgress);
        } else {
            console.log('Pet already reached lowest evolution');
        }
    };

    const getPetImage = () => {
        if (progress < 30) {
            return "src/assets/unicorn_unhached_eating.gif";
        } else if (progress < 70) {
            return "src/assets/unicorn.gif";
        } else {
            return "src/assets/sleeping_penguin2.gif";
        }
    };

    return (
        <div
            className="bg-primary-300 w-full h-full rounded-xl flex flex-col bg-cover bg-center"
            style={{ backgroundImage: "url('')" }}
        >
            <div className="flex flex-row justify-between">
                <h1 className="text-xl font-bold ml-4 mt-4">Pets</h1>
                <div className="w-28 h-8 bg-shades-light rounded-xl ml-auto mr-5 mt-5 flex justify-center items-center text-lg font-semibold">
                    {currency}
                </div>
            </div>
            <div className="flex justify-center">                
                <h2 className="">{petName}</h2>
            </div>
            <div className="flex flex-col items-center">
                {/* Animated pet */}
                <img
                    src={getPetImage()}
                    alt="Pet"
                    className="w-10 h-64 md:w-96 md:h-96 object-contain transition-all duration-500"
                />
                <div className="w-64 md:w-96">
                    <progress
                        id="progressBar"
                        max={100}
                        value={progress}
                        className="w-full"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    ></progress>
                    <div className="text-center mb-2">{progress}%</div>
                </div>
            </div>
            <div className="mt-auto flex justify-center pb-6">
                <button
                    id="feedButton"
                    className="bg-red-600 text-shades-light w-36 h-12 rounded-lg hover:bg-red-500 text-lg font-semibold"
                    onClick={feedPetClick}
                >
                    Feed
                </button>
                <button
                    id="feedButton"
                    className="bg-green-500 text-shades-light w-36 h-12 rounded-lg hover:bg-green-300 text-lg font-semibold"
                    onClick={addCash}
                >
                    Add Cash
                </button>
                <button
                    id="feedButton"
                    className="bg-orange-500 text-shades-light w-36 h-12 rounded-lg hover:bg-orange-300 text-lg font-semibold"
                    onClick={decreaseProgress}
                >
                    Decrease
                </button>
            </div>
        </div>
    );
};

export default Pets;
