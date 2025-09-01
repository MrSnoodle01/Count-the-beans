import './App.css'
import MatterScene from './components/MatterScene.tsx'
import Guesses from './components/Guesses.tsx'
import { useState } from 'react'

export default function App() {
  const tempTime = new Date();
  const [time, setTime] = useState(tempTime.toLocaleTimeString());
  const [guess, setGuess] = useState(0);
  const [numberOfBeans, setNumberOfBeans] = useState(Math.floor(Math.random() * 500) + 50);
  const [guesses, setGuesses] = useState<string[]>([]);

  setInterval(() => {
    const newTime = new Date();
    setTime(newTime.toLocaleTimeString());
  }, 1000);

  return (
    <div className='page-center'>
      <h1>
        {time}
      </h1>
      <div className='top-section'>
        <div className='guess-input'>
          <label htmlFor="numberGuess">Guess how many beans</label>
          <input name="numberGuess" id="numberGuess" type="number" onChange={e => setGuess(Number(e.target.value))} />
          <button onClick={() => {
            if (guesses.length <= 4) {
              setGuesses([...guesses, getGuessDistance(guess, numberOfBeans)]);
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

function getGuessDistance(guess: number, answer: number) {
  if (guess === answer) {
    alert("You got it right! 🎉");
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