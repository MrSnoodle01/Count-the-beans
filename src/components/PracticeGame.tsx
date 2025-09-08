import MatterScene from './MatterScene.tsx'
import Guesses from './Guesses.tsx'
import YouWinModal from './YouWinModal.tsx'
import { useState } from 'react'

export default function PracticeGame() {

    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = useState([] as string[]);
    const [previousGuess, setPreviousGuess] = useState(0);
    const [winScreenOpen, setWinScreenOpen] = useState(false);
    const [matterInfo, setMatterInfo] = useState({ numberOfBeans: Math.floor(Math.random() * 500) + 50, container: Math.floor(Math.random() * 3) });

    const openModal = () => setWinScreenOpen(true);
    const closeModal = () => setWinScreenOpen(false);

    function getGuessDistance(guess: number, answer: number) {
        if (guesses.length === 4) {
            openModal();
        }
        if (guess === answer) {
            openModal();
            return (guess + " 🎉");
        } else if (Math.abs(guess - answer) <= 10) {
            if (guess > answer) {
                return (guess + " ⬇️ Boiling! 🔥");
            }
            return (guess + " ⬆️ Boiling! 🔥")
        } else if (Math.abs(guess - answer) <= 25) {
            if (guess > answer) {
                return (guess + " ⬇️ Hot 🌡️");
            }
            return (guess + " ⬆️ Hot 🌡️")
        } else {
            if (guess > answer) {
                return (guess + " ⬇️ Cold 🧊");
            }
            return (guess + " ⬆️ Cold 🧊")
        }
    }

    return (
        <>
            <YouWinModal
                isOpen={winScreenOpen}
                onClose={closeModal}
                guesses={guesses}
                tries={previousGuess === matterInfo.numberOfBeans ? String(guesses.length) : "X"}
                answer={matterInfo.numberOfBeans}
                day={0}
                usingPractice={true}
            />
            <div className='top-section'>
                <div className='guess-input'>
                    <label htmlFor="numberGuess">Guess how many beans</label>
                    <input name="numberGuess" id="numberGuess" type="number" onChange={e => setGuess(e.target.value)} />
                    <button onClick={() => {
                        let regex = /^\d+$/;
                        if (!regex.test(guess)) {
                            alert("Please enter a valid number");
                            return;
                        }
                        if (guesses.length <= 4 && previousGuess !== matterInfo.numberOfBeans) {
                            setGuesses([...guesses, getGuessDistance(Number(guess), matterInfo.numberOfBeans)]);
                            setPreviousGuess(Number(guess));
                        }
                    }}>
                        Submit
                    </button>
                    {(guesses.length === 5 || previousGuess === matterInfo.numberOfBeans) &&
                        <button onClick={() => {
                            openModal();
                        }
                        }>
                            See Score
                        </button>}
                </div>
                <Guesses guesses={guesses} />
            </div>
            <div className='bean-screen'>
                <MatterScene
                    numberOfBeans={matterInfo.numberOfBeans}
                    container={matterInfo.container}
                />
            </div>
        </>

    )
}