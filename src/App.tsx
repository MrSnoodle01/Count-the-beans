import './App.css';
import { useState } from 'react';
import DailyGame from './components/DailyGame';
import PracticeGame from './components/PracticeGame';

export default function App() {
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceRound, setPracticeRound] = useState(0);

  return (
    <div className="page-center">
      <div className="top-section">
        <button onClick={() => setPracticeMode(!practiceMode)}>
          {practiceMode ? "Go To Daily Mode" : "Go To Practice Mode"}
        </button>
        {practiceMode && <button onClick={() => setPracticeRound(practiceRound + 1)}>New Practice Round</button>}
      </div>
      {practiceMode ? <PracticeGame key={practiceRound} /> : <DailyGame />}
    </div>
  )
}