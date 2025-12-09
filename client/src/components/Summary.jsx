import { useNavigate } from "react-router-dom";
import QUESTIONS from "../questions.js";

function Summary({ userAnswers }) {
  const navigate = useNavigate();

  // Filter out correct answers by comparing user answers with the first answer in QUESTIONS
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === QUESTIONS[index].answers[0]
  );

  // Filter out skipped answers (null)
  const skippedAnswers = userAnswers.filter((answer) => answer === null);

  // Calculate percentage of correct answers
  const correctPercentage = Math.round(
    (correctAnswers.length / QUESTIONS.length) * 100
  );

  return (
    <div id="summary">
      <h2>Quiz Completed</h2>

      <div id="summary-stats">
        <p>
          <span className="number">{correctPercentage}%</span>
          <span className="text">Correct</span>
        </p>
        <p>
          <span className="number">{skippedAnswers.length}</span>
          <span className="text">Skipped</span>
        </p>
        <p>
          <span className="number">
            {QUESTIONS.length - correctAnswers.length - skippedAnswers.length}
          </span>
          <span className="text">Incorrect</span>
        </p>
      </div>

      <ol>
        {userAnswers.map((answer, index) => {
          let cssClass = "user-answer";
          if (answer === null) cssClass += " skipped";
          else if (answer === QUESTIONS[index].answers[0])
            cssClass += " correct";
          else cssClass += " wrong";

          return (
            <li key={index}>
              <h3>Q{index + 1}</h3>
              <p className="question">{QUESTIONS[index].text}</p>
              <p className={cssClass}>{answer ?? "Skipped"}</p>
            </li>
          );
        })}
      </ol>

      <p className="status-message">
        {correctPercentage >= 70
          ? "✅ You passed and can move on to Level 3!"
          : "⚠️ You need at least 70% correct to unlock Level 3"}
      </p>

      <button onClick={() => navigate("/play")}>⬅ Back to Escape Room</button>
    </div>
  );
}

export default Summary;
