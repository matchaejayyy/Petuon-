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
      className="bg-primary-300 flex h-full w-full flex-col rounded-xl bg-cover bg-center"
      style={{ backgroundImage: "url('')" }}
    >
      <div className="flex flex-row justify-between">
        <h1 className="ml-4 mt-4 text-xl font-bold">Pets</h1>
        <div className="bg-shades-light ml-auto mr-5 mt-5 flex h-8 w-28 items-center justify-center rounded-xl text-lg font-semibold">
          {currency}
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center">
        {/* Animated pet */}
        <img
          src={getPetImage()}
          alt="Pet"
          className="h-64 w-10 object-contain transition-all duration-500 md:h-96 md:w-96"
        />
        <progress
          id="progressBar"
          max={100}
          value={progress}
          className="mt-6 w-64 md:w-96"
        ></progress>
      </div>
      <div className="mt-auto flex justify-center pb-6">
        <button
          id="feedButton"
          className="text-shades-light h-12 w-36 rounded-lg bg-red-600 text-lg font-semibold hover:bg-red-500"
          onClick={feedPetClick}
        >
          Feed
        </button>
      </div>
    </div>
  );
};

export default Pets;
