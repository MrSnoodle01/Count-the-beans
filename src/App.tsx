import './App.css'
import { useState } from 'react'

function App() {
  const tempTime = new Date();
  const [time, setTime] = useState(tempTime.toLocaleTimeString());

  setInterval(() => {
    const newTime = new Date();
    setTime(newTime.toLocaleTimeString());
  }, 1000);

  return (
    <>
      <h1>
        {time}
      </h1>
      {time === '10:29:10 AM' ? <h2>Time to count the beans!</h2> : <h2>Time to NOT count the beans!</h2>}
    </>
  )
}

export default App
