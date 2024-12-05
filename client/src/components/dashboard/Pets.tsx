import { useState } from "react";

const Pets = () => {
    const [currency, setCurrency] = useState(1000);
    const [progress, setProgress] = useState(0);

    const feedPetClick = () => {
        if (currency >= 100) {
            if (progress < 100) {
                setCurrency(currency - 100);
                setProgress(progress + 5);
                console.log("pet has been fed");
            } else {
                console.log("Pet already reached final evolution");
            }
        } else {
            console.log("You don't have enough money to feed your pet");
        }
    };

    const getPetImage = () => {
        if (progress < 30) {
            return "src/assets/unicorn_hatched_eating.gif";
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
            <div className="flex flex-col items-center mt-10">
                {/* Animated pet */}
                <img
                    src={getPetImage()}
                    alt="Pet"
                    className="w-10 h-64 md:w-96 md:h-96 object-contain transition-all duration-500"
                />
                <progress
                    id="progressBar"
                    max={100}
                    value={progress}
                    className="w-64 md:w-96 mt-6"
                ></progress>
            </div>
            <div className="mt-auto flex justify-center pb-6">
                <button
                    id="feedButton"
                    className="bg-red-600 text-shades-light w-36 h-12 rounded-lg hover:bg-red-500 text-lg font-semibold"
                    onClick={feedPetClick}
                >
                    Feed
                </button>
            </div>
        </div>
    );
};

export default Pets;
