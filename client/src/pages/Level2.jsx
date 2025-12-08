import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import QUESTIONS from "../questions.js";
import Question from "../components/Question.jsx";
import Summary from "../components/Summary.jsx";
import "../styles/Level2.css";

function Level2({ currentLevel, setCurrentLevel }) {
  const [userAnswers, setUserAnswers] = useState([]);

  const activeQuestionIndex = userAnswers.length;
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer
  ) {
    setUserAnswers((preUserAnswer) => {
      return [...preUserAnswer, selectedAnswer];
    });
  },
  []);

  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  );

  // Unlock Level 3 when quiz is complete
  useEffect(() => {
    if (quizIsComplete && currentLevel < 3) {
      setCurrentLevel(3);
    }
  }, [quizIsComplete, currentLevel, setCurrentLevel]);

  if (currentLevel < 2) {
    return <Navigate to="/play" replace />;
  }

  if (quizIsComplete) {
    return (
      <Summary userAnswers={userAnswers} setCurrentLevel={setCurrentLevel} />
    );
  }

  return (
    <div>
      <h1>Level 2: Trivia Quiz</h1>
      <div id="quiz">
        <Question
          key={activeQuestionIndex}
          index={activeQuestionIndex}
          onSelectAnswer={handleSelectAnswer}
          onSkipAnswer={handleSkipAnswer}
        />
      </div>
    </div>
  );
}

export default Level2;
