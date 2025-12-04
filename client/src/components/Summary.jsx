import { useEffect } from "react";
import QUESTIONS from "../questions.js";

function Summary({ userAnswers }) {
  const skippedAnswers = userAnswers.filter((answer) => answer === null);
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === QUESTIONS[index].answers[0]
  );

  const skippedAnswersShare = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );

  const correctAnswersShare = Math.round(
    (correctAnswers.length / userAnswers.length) * 100
  );
  const wrongAnswersShare = 100 - skippedAnswersShare - correctAnswersShare;

  // XP points
  const point = correctAnswers.length;

  useEffect(() => {
    async function sendXP() {
      try {
        // Get user session information (required for backend)
        const meRes = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        const meData = await meRes.json();

        if (!meData || !meData.user) return;

        const userId = meData.user.id;

        // Send XP to backend
        await fetch("http://localhost:3000/api/earn-points", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            points: points,
          }),
        });

        console.log("XP awarded:", points);
      } catch (err) {
        console.error("Error adding XP:", err);
      }
    }

    sendXP();
  }, []);

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
      <button>Next Game</button>
    </div>
  );
}

export default Summary;
