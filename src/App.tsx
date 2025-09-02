import './App.css'
import MatterScene from './components/MatterScene.tsx'
import Guesses from './components/Guesses.tsx'
import YouWinModal from './components/YouWinModal.tsx'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export default function App() {
  const supabaseUrl = import.meta.env.VITE_DATABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_DATABASE_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const originalDate = new Date('2025-9-1');
  const currentDate = new Date();

  const [guess, setGuess] = useState("");
  // const [numberOfBeans, setNumberOfBeans] = useState(Math.floor(Math.random() * 500) + 50);
  const [numberOfBeans, setNumberOfBeans] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [previousGuess, setPreviousGuess] = useState(0);
  const [winScreenOpen, setWinScreenOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [container, setContainer] = useState(0);

  const openModal = () => setWinScreenOpen(true);
  const closeModal = () => setWinScreenOpen(false);

  function getDate(): number {
    const oneDay = 1000 * 60 * 60 * 24;
    const differenceMs = Math.abs(originalDate.getTime() - currentDate.getTime());
    return Math.floor(differenceMs / oneDay);
  }

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

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('data').select();
      if (data) {
        setNumberOfBeans(data[getDate()].beanCount);
        setDay(data[getDate()].day);
        setContainer(data[getDate()].container - 1);
        console.log(data[getDate()]);
      }
    }
    fetchData();
  }, [])

  return (
    <div className='page-center'>
      <YouWinModal
        isOpen={winScreenOpen}
        onClose={closeModal}
        guesses={guesses}
        tries={previousGuess === numberOfBeans ? String(guesses.length) : "X"} answer={numberOfBeans}
        day={day}
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
        {/* <h3>{numberOfBeans}</h3>
        <button onClick={() => {
          setNumberOfBeans(Math.floor(Math.random() * 500) + 50);
          setGuesses([]);
        }}>Respawn beans</button> */}
        <MatterScene
          numberOfBeans={numberOfBeans}
          container={container}
        />
      </div>
    </div >
  )
}