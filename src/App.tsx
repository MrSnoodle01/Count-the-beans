import './App.css'
import MatterScene from './components/MatterScene.tsx'
import { useState } from 'react'

export default function App() {
  const tempTime = new Date();
  const [time, setTime] = useState(tempTime.toLocaleTimeString());
  const [guess, setGuess] = useState(0);
  const [numberOfBeans, setNumberOfBeans] = useState(Math.floor(Math.random() * 500));

  setInterval(() => {
    const newTime = new Date();
    setTime(newTime.toLocaleTimeString());
  }, 1000);

  return (
    <div className='page-center'>
      <h1>
        {time}
      </h1>
      {time === '10:29:10 AM' ? <h2>Time to count the beans!</h2> : <h2>Time to NOT count the beans!</h2>}
      <div className='guess-input'>
        <label htmlFor="numberGuess">Guess how many beans</label>
        <input name="numberGuess" id="numberGuess" type="number" onChange={e => setGuess(Number(e.target.value))} />
        <button onClick={() => checkGuess(guess, numberOfBeans)}>Submit</button>
      </div>
      <div className='bean-screen'>
        <h3>{numberOfBeans}</h3>
        <button onClick={() => setNumberOfBeans(Math.floor(Math.random() * 500))}>Respawn beans</button>
        <MatterScene numberOfBeans={numberOfBeans} />
      </div>
    </div>
  )
}

function checkGuess(guess: number, answer: number) {
  if (guess === answer) {
    alert("Correct! You must have a photographic memory!");
  } else if (Math.abs(guess - answer) <= 10) {
    alert(`Close! The answer was ${answer}`);
  } else {
    alert(`Wrong! The answer was ${answer}`);
  }
}