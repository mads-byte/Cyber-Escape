import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import QUESTIONS from "../questions.js";
import Question from "../components/Question.jsx";
import Summary from "../components/Summary.jsx";
import "../styles/Level2.css";

function Level2({ currentLevel, setCurrentLevel }) {
  // Store user's selected answers
  const [userAnswers, setUserAnswers] = useState([]);

  // Determine the current active question index
  const activeQuestionIndex = userAnswers.length;

  // Check if the quiz is complete (all questions answered or skipped)
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;

  // Handle user selecting an answer
  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer
  ) {
    setUserAnswers((preUserAnswer) => {
      return [...preUserAnswer, selectedAnswer];
    });
  },
  []);

  // Handle skipping a question
  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  );

  // Unlock Level 3 only if quiz is complete AND >=70% correct answers
  useEffect(() => {
    if (!quizIsComplete) return;

    // Count number of correct answers
    const correctCount = userAnswers.filter(
      (answer, idx) => answer === QUESTIONS[idx].answers[0]
    ).length;

    // Calculate percentage of correct answers
    const correctPercentage = (correctCount / QUESTIONS.length) * 100;

    if (correctPercentage >= 70 && currentLevel < 3) {
      setCurrentLevel(3);
    }
  }, [quizIsComplete, userAnswers, currentLevel, setCurrentLevel]);

  // Redirect user to escape room main page
  if (currentLevel < 2) {
    return <Navigate to="/play" replace />;
  }

  // If quiz is complete, show the summary component
  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />;
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
