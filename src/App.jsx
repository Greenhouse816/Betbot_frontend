import { useState, useMemo, useEffect, useRef } from 'react'
import { Route, Routes } from "react-router-dom";

import LeaderboardLayout from './layouts/Leaderboard';

import Home from './pages/Home'
import HorseProfile from './pages/HorseProfile'
import TrainerProfile from './pages/TrainerProfile'
import JockeyProfile from './pages/JockeyProfile'
import Predictor from './pages/Leaderboard/Predictor'
import TrainerBoard from './pages/Leaderboard/TrainerBoard'
import JockeyBoard from './pages/Leaderboard/JockeyBoard'
import HorseBoard from './pages/Leaderboard/HorseBoard'

import { marketContext } from "./contexts/marketContext";
import { eventsContext } from "./contexts/eventsContext";
import { clockContext } from "./contexts/clockContext";

function App() {
  const [market, setMarket] = useState ('')
  const [events, setEvents] = useState ([])
  const clock = useRef (new Date().getTime())
  const setClock = (t) => clock.current = t
  
  const marketValue = useMemo(
    () => ({ market, setMarket }),
    [market]
  );

  const eventsValue = useMemo(
    () => ({ events, setEvents }),
    [events]
  );
  
  const clockValue = useMemo(
    () => ({ clock, setClock }),
    [clock]
  );

  useEffect(() => {
    const interval = setInterval(()=>setClock(new Date().getTime()), 1000)
    return () => clearInterval (interval)
  })

  return (
    <eventsContext.Provider value={eventsValue}>
      <marketContext.Provider value={marketValue}>
        <clockContext.Provider value={clockValue}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/horse/au/:id" element={<HorseProfile />} />
            <Route path="/trainer/au/:id" element={<TrainerProfile />} />
            <Route path="/jockey/au/:id" element={<JockeyProfile />} />
            <Route element={<LeaderboardLayout />}>
              <Route path="/predictor" element={<Predictor />} />
              <Route path="/board/trainer" element={<TrainerBoard />} />
              <Route path="/board/horse" element={<HorseBoard />} />
              <Route path="/board/jockey" element={<JockeyBoard />} />
            </Route>
          </Routes>
        </clockContext.Provider>
      </marketContext.Provider>
    </eventsContext.Provider>
  )
}

export default App
