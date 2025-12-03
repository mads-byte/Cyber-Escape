import { useState, useEffect } from "react";

function QuestionTimer({ timeout, onTimeout }) {
  // Track remaining time
  const [remainingTime, setReainingTime] = useState(timeout);

  useEffect(() => {
    console.log("SETTING TIMEOUT");
    const timer = setTimeout(onTimeout, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeout]);

  // Interval to update remaining time every 1 seconds
  useEffect(() => {
    console.log("SETTING INTERVAL");
    const interval = setInterval(() => {
      setReainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress id="question-time" max={timeout} value={remainingTime} />;
}

export default QuestionTimer;
