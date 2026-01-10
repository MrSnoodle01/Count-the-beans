import MatterScene from './MatterScene.tsx'
import Guesses from './Guesses.tsx'
import YouWinModal from './YouWinModal.tsx'
import { useEffect, useState } from 'react'
import persistedState from '../assets/usePersistedState.ts'

export default function DailyGame() {
    const originalDate = new Date('2025/8/31');
    const currentDate = new Date();

    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = persistedState<string[]>('guesses', []);
    const [previousGuess, setPreviousGuess] = persistedState<number>('previousGuess', 0);
    const [winScreenOpen, setWinScreenOpen] = useState(false);
    const [day, setDay] = persistedState<number>('day', getDate());
    const [matterInfo, setMatterInfo] = useState({ numberOfBeans: 0, container: 0 });

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

    function jenkinsHash(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            const charCode = key.charCodeAt(i);
            hash += charCode;
            hash += (hash << 10);
            hash ^= (hash >>> 6);
        }
        hash += (hash << 3);
        hash ^= (hash >>> 11);
        hash += (hash << 15);

        return hash | 0;
    }

    useEffect(() => {
        closeModal();
        const fetchData = async () => {
            if (getDate() === day) { // if day in local storage is equal to current day dont update anything, only spawn in beans again
                setMatterInfo({ numberOfBeans: Math.abs(jenkinsHash(String(getDate())) % 500) + 50, container: Math.abs(jenkinsHash(String(getDate() * 23)) % 3) });
            } else { // if there is a new day then update everything to the next day, or if day > getDate, meaning the days have become unsynced. So sync them again
                setGuesses([]);
                setPreviousGuess(0);
                setDay(getDate());
                setMatterInfo({ numberOfBeans: Math.abs(jenkinsHash(String(getDate())) % 500) + 50, container: Math.abs(jenkinsHash(String(getDate() * 23)) % 3) });
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <YouWinModal
                isOpen={winScreenOpen}
                onClose={closeModal}
                guesses={guesses}
                tries={previousGuess === matterInfo.numberOfBeans ? String(guesses.length) : "X"}
                answer={matterInfo.numberOfBeans}
                day={day}
                usingPractice={false}
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
                        var form = document.getElementById("numberGuess") as HTMLInputElement;
                        form.value = '';
                        setGuess("");
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