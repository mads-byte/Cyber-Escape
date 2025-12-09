import { useState } from "react";

import QuestionTimer from "./QuestionTimer";
import Answers from "./Answer";
import QUESTIONS from "../questions.js";

// Display a single quiz question
function Question({ index, onSelectAnswer, onSkipAnswer }) {
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null,
  });

  // Handle selecting an answer
  function handleSelectAnswer(answer) {
    // Immediately mark the answer as selected, correctness unknown
    setAnswer({
      selectedAnswer: answer,
      isCorrect: null,
    });

    // After 1 second, determine if the answer is correct
    setTimeout(() => {
      setAnswer({
        selectedAnswer: answer,
        // Currently assumes first answer in array is correct
        isCorrect: QUESTIONS[index].answers[0] === answer,
      });

      // After 2 more seconds, that answer is finalized
      setTimeout(() => {
        onSelectAnswer(answer);
      }, 2000);
    }, 1000);
  }

  // Determine the current state of the answer
  let answerState = "";

  if (answer.selectedAnswer && answer.isCorrect !== null) {
    // Answer has been selected and correctness is known
    answerState = answer.isCorrect ? "correct" : "wrong";
  } else if (answer.selectedAnswer) {
    answerState = "answered";
  }

  return (
    <div id="question">
      <QuestionTimer timeout={40000} onTimeout={onSkipAnswer} />
      <h2>{QUESTIONS[index].text}</h2>
      <Answers
        answers={QUESTIONS[index].answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
}

export default Question;
