import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  const transition = (transitionMode, replace = false) => {
    setMode(transitionMode);
    if (replace) {
      setHistory(prev => [...prev.slice(0, -1), transitionMode]);
    } else {
      setHistory(prev => [...prev, transitionMode]);
    }
  }

  const back = () => {
    
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  }

  return { mode, transition, back };
}