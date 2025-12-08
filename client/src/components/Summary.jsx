import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QUESTIONS from "../questions.js";

function Summary({ userAnswers, setCurrentLevel }) {
  const navigate = useNavigate();

  // Filters answers that the user skipped
  const skippedAnswers = userAnswers.filter((answer) => answer === null);
  // Filters answers that are correct by checking if the user's answer matches the first answer
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === QUESTIONS[index].answers[0]
  );

  // Calculate percentage of skipped answers
  const skippedAnswersShare = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );

  // Calculate percentage of correct answers
  const correctAnswersShare = Math.round(
    (correctAnswers.length / userAnswers.length) * 100
  );
  const wrongAnswersShare = 100 - skippedAnswersShare - correctAnswersShare;

  // XP = number of correct answers
  const points = correctAnswers.length;

  useEffect(() => {
    async function sendXP() {
      try {
        // Fetch the logged-in user
        const meRes = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        const meData = await meRes.json();
        // Ensure user exists
        if (!meData || !meData.user) return;
        // object with multiple fields
        const userId = meData.user.id;

        // Send XP to backend
        await fetch("http://localhost:3000/api/earn-points", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            points,
          }),
        });

        console.log("XP awarded:", points);

        // Unlock Level 3
        if (setCurrentLevel) setCurrentLevel(3);
      } catch (err) {
        console.error("Error adding XP:", err);
      }
    }

    sendXP();
  }, [points, setCurrentLevel]);

  return (
    <div id="summary">
      <h2>Quiz Completed</h2>

      <div id="summary-stats">
        <p>
          <span className="number">{skippedAnswersShare}%</span>
          <span className="text">skipped</span>
        </p>
        <p>
          <span className="number">{correctAnswersShare}%</span>
          <span className="text">Correctly</span>
        </p>
        <p>
          <span className="number">{wrongAnswersShare}%</span>
          <span className="text">Incorrectly</span>
        </p>
      </div>
      <ol>
        {userAnswers.map((answer, index) => {
          let cssClass = "user-answer";

          if (answer === null) {
            cssClass += " skipped";
          } else if (answer === QUESTIONS[index].answers[0]) {
            cssClass += " correct";
          } else {
            cssClass += " wrong";
          }

          return (
            <li key={index}>
              <h3>{index + 1}</h3>
              <p className="question">{QUESTIONS[index].text}</p>
              <p className={cssClass}>{answer ?? "Skipped"}</p>
            </li>
          );
        })}
      </ol>

      <button onClick={() => navigate("/play")}>⬅ Back to Escape Room</button>
    </div>
  );
}

export default Summary;
