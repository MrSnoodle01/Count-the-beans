import './App.css'
import MatterScene from './components/MatterScene.tsx'
import Guesses from './components/Guesses.tsx'
import YouWinModal from './components/YouWinModal.tsx'
import { useState } from 'react'

export default function App() {
  const tempTime = new Date();
  const [time, setTime] = useState(tempTime.toLocaleTimeString());
  const [guess, setGuess] = useState("");
  const [numberOfBeans, setNumberOfBeans] = useState(Math.floor(Math.random() * 500) + 50);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [previousGuess, setPreviousGuess] = useState(0);
  const [winScreenOpen, setWinScreenOpen] = useState(false);

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

  setInterval(() => {
    const newTime = new Date();
    setTime(newTime.toLocaleTimeString());
  }, 1000);

  return (
    <div className='page-center'>
      <h1>
        {time}
      </h1>
      <YouWinModal
        isOpen={winScreenOpen}
        onClose={closeModal}
        guesses={guesses}
        tries={previousGuess === numberOfBeans ? String(guesses.length) : "X"} answer={numberOfBeans}
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
            if (guesses.length <= 4 && previousGuess !== numberOfBeans) {
              setGuesses([...guesses, getGuessDistance(Number(guess), numberOfBeans)]);
              setPreviousGuess(Number(guess));
            }
          }}>Submit</button>
        </div>
        <Guesses guesses={guesses} />
      </div>
      <div className='bean-screen'>
        <h3>{numberOfBeans}</h3>
        <button onClick={() => {
          setNumberOfBeans(Math.floor(Math.random() * 500) + 50);
          setGuesses([]);
        }}>Respawn beans</button>
        <MatterScene numberOfBeans={numberOfBeans} />
      </div>
    </div >
  )
}