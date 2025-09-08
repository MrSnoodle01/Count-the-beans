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
  const originalDate = new Date('2025-8-31');
  const currentDate = new Date();

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = persistedState<string[]>('guesses', []);
  const [previousGuess, setPreviousGuess] = persistedState<number>('previousGuess', 0);
  const [winScreenOpen, setWinScreenOpen] = useState(false);
  const [day, setDay] = persistedState<number>('day', getDate());
  const [matterInfo, setMatterInfo] = useState({ numberOfBeans: 0, container: 0 });
  const [practiceMode, setPracticeMode] = useState({ usingPractice: false, guesses: [] as string[], beanCount: 0, container: 0, guess: "", previousGuess: 0 });

  const openModal = () => setWinScreenOpen(true);
  const closeModal = () => setWinScreenOpen(false);

  function getDate(): number {
    const oneDay = 1000 * 60 * 60 * 24;
    const differenceMs = Math.abs(originalDate.getTime() - currentDate.getTime());
    return Math.floor(differenceMs / oneDay);
  }

  function getGuessDistance(guess: number, answer: number) {
    if (practiceMode.usingPractice) {
      if (practiceMode.guesses.length === 4) {
        openModal();
      }
    } else {
      if (guesses.length === 4) {
        openModal();
      }
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
    closeModal();
    const fetchData = async () => {
      if (getDate() === day) { // if day in local storage is equal to current day dont update anything, only spawn in beans again
        const { data } = await supabase.from('data').select().eq('day', getDate());
        if (data) {
          setMatterInfo({ numberOfBeans: data[0].beanCount, container: data[0].container - 1 });
        }
      } else { // if there is a new day then update everything to the next day, or if day > getDate, meaning the days have become unsynced. So sync them again
        const { data } = await supabase.from('data').select().eq('day', getDate());
        if (data) {
          setGuesses([]);
          setPreviousGuess(0);
          setDay(data[0].day);
          setMatterInfo({ numberOfBeans: data[0].beanCount, container: data[0].container - 1 });
        }
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
          guesses={practiceMode.usingPractice ? practiceMode.guesses : guesses}
          tries={practiceMode.usingPractice ?
            practiceMode.previousGuess === practiceMode.beanCount ? String(practiceMode.guesses.length) : "X" :
            previousGuess === matterInfo.numberOfBeans ? String(guesses.length) : "X"}
          answer={practiceMode.usingPractice ? practiceMode.beanCount : matterInfo.numberOfBeans}
          day={day}
          usingPractice={practiceMode.usingPractice}
        />
        <div className='top-section'>
          <div className='guess-input'>
            <div className='top-section'>
              <button onClick={() => setPracticeMode({
                usingPractice: !practiceMode.usingPractice,
                guesses: [],
                beanCount: Math.floor(Math.random() * 500) + 50,
                container: Math.floor(Math.random() * 3),
                guess: "",
                previousGuess: 0
              })}>
                {practiceMode.usingPractice ? "Go To Daily Mode" : "Go To Practice Mode"}
              </button>
              {practiceMode.usingPractice &&
                <button onClick={() => setPracticeMode({
                  ...practiceMode,
                  guesses: [],
                  beanCount: Math.floor(Math.random() * 500) + 50,
                  container: Math.floor(Math.random() * 3),
                  guess: "",
                  previousGuess: 0
                })}>
                  New Practice Round
                </button>}
            </div>

            <label>Guess how many beans</label>
            <input
              type="number"
              onChange={e => practiceMode.usingPractice ? setPracticeMode({ ...practiceMode, guess: e.target.value }) : setGuess(e.target.value)}
              value={practiceMode.usingPractice ? practiceMode.guess : guess}
            />
            <button onClick={() => {
              let regex = /^\d+$/;
              if (practiceMode.usingPractice) {
                if (!regex.test(practiceMode.guess)) {
                  alert("Please enter a valid number");
                  return;
                }
                if (practiceMode.guesses.length <= 4 && practiceMode.previousGuess !== practiceMode.beanCount) {
                  setPracticeMode({ ...practiceMode, guesses: [...practiceMode.guesses, getGuessDistance(Number(practiceMode.guess), practiceMode.beanCount)], previousGuess: Number(practiceMode.guess) })
                }
              } else {
                if (!regex.test(guess)) {
                  alert("Please enter a valid number");
                  return;
                }
                if (guesses.length <= 4 && previousGuess !== matterInfo.numberOfBeans) {
                  setGuesses([...guesses, getGuessDistance(Number(guess), matterInfo.numberOfBeans)]);
                  setPreviousGuess(Number(guess));
                }
              }
            }}>
              Submit
            </button>
            {practiceMode.usingPractice
              ?
              (practiceMode.guesses.length === 5 || practiceMode.previousGuess === practiceMode.beanCount) &&
              <button onClick={() => {
                openModal();
              }
              }>
                See Score
              </button>
              :
              (guesses.length === 5 || previousGuess === matterInfo.numberOfBeans) &&
              <button onClick={() => {
                openModal();
              }
              }>
                See Score
              </button>}
          </div>
          <Guesses guesses={practiceMode.usingPractice ? practiceMode.guesses : guesses} />
        </div>
        <div className='bean-screen'>
          <MatterScene
            numberOfBeans={practiceMode.usingPractice ? practiceMode.beanCount : matterInfo.numberOfBeans}
            container={practiceMode.usingPractice ? practiceMode.container : matterInfo.container}
          />
        </div>
      </div >
    </>

  )
}