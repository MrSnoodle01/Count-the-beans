import './App.css'
import MatterScene from './components/MatterScene.tsx'
import Guesses from './components/Guesses.tsx'
import YouWinModal from './components/YouWinModal.tsx'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import persistedState from './assets/usePersistedState.ts'

export default function App() {
  const supabaseUrl = import.meta.env.VITE_DATABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_DATABASE_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const originalDate = new Date('2025-9-1');
  const currentDate = new Date();

  const [guess, setGuess] = useState("");
  const [numberOfBeans, setNumberOfBeans] = useState(0);
  const [guesses, setGuesses] = persistedState<string[]>('guesses', []);
  const [previousGuess, setPreviousGuess] = persistedState<number>('previousGuess', 0);
  const [winScreenOpen, setWinScreenOpen] = useState(false);
  const [day, setDay] = persistedState<number>('day', 1);
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
      // need this local bean count to check if user has previously won since useState wont update until next render
      let localBeanCount = 0;

      // if day in local storage is equal to current day dont update anything, only spawn in beans again
      if (getDate() === day - 1) {
        const { data } = await supabase.from('data').select().eq('day', day);
        if (data) {
          setNumberOfBeans(data[0].beanCount);
          localBeanCount = data[0].beanCount;
          setContainer(data[0].container - 1);
        }
      } else { // else if there is a new day then update everything to the next day
        const { data } = await supabase.from('data').select().eq('day', day + 1);
        if (data) {
          setGuesses([]);
          setPreviousGuess(0);
          setDay(data[0].day);
          setNumberOfBeans(data[0].beanCount);
          localBeanCount = data[0].beanCount;
          setContainer(data[0].container - 1);
        }
      }
      if (guesses.length === 5 || (previousGuess === localBeanCount && localBeanCount !== 0)) {
        openModal();
      }
    }
    fetchData();
  }, [])

  return (
    <>
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
            }}>
              Submit
            </button>
            {(guesses.length === 5 || previousGuess === numberOfBeans) &&
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
            numberOfBeans={numberOfBeans}
            container={container}
          />
        </div>
      </div >
    </>

  )
}