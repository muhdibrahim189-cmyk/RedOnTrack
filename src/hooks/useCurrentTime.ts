/**
 * Hook for managing current time with auto-update
 * Single Responsibility - only handles time state
 */

import { useState, useEffect } from 'react';

interface UseCurrentTimeReturn {
  currentTime: string;
  currentDate: Date;
}

export function useCurrentTime(): UseCurrentTimeReturn {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { currentTime, currentDate };
}
