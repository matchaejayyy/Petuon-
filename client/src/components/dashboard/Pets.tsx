import { useState } from "react"

const Pets = () => {

    const [currency, setCurrency] = useState(1000)
    const [progress, setProgress] = useState(0)

    const feedPetClick = () => {
        if(currency >= 100) {
            if (progress < 100) {
                setCurrency(currency - 100)
                setProgress(progress + 5);
                console.log("pet has been fed")
            } else {
                console.log("Pet already reached final evolution")
            }
        } 
        else {
            console.log("You dont have enough money to feed your pet")
        }
    };

    return (
        <div 
        className="bg-primary-300 w-full h-full rounded-xl flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('')" }}>
            <div className="flex flex-row justify-between">
                <h1 className="">Pets</h1>
                <div className="w-28 h-8 bg-shades-light rounded-xl ml-auto mr-5 mt-5 flex justify-center">
                    {currency}
                </div>
            </div>
            <div>
                <progress id="progressBar" max={100} value={progress}></progress>
            </div>
            <div className="mt-auto flex justify-center pb-4">
                <button id="feedButton" className="bg-red-600 text-shades-light w-36 h-11" onClick={feedPetClick}>Feed</button>
            </div>
        </div>
    )
}

export default Pets