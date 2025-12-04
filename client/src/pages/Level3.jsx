import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Level3.css";

const scenarios = [
  {
    id: 1,
    title: "Always-True Login",
    text: "Username: admin  Password: ' OR 1=1 --",
    isInjection: true,
    explanation:
      "This uses OR 1=1 to force the WHERE clause to always be true and the comment (--) to ignore the rest of the query.",
  },
  {
    id: 2,
    title: "Normal Login Attempt",
    text: "Username: jason.smith  Password: Winter!2025",
    isInjection: false,
    explanation:
      "This looks like a normal username and password with no SQL operators or comment characters.",
  },
  {
    id: 3,
    title: "Sneaky UNION Attack",
    text: "Email: test@example.com' UNION SELECT card_number, cvv FROM payments --",
    isInjection: true,
    explanation:
      "UNION SELECT is being used to pull data from another table (payments) and piggyback on the original query.",
  },
  {
    id: 4,
    title: "Forgot Password Request",
    text: "Email: alex.williams@example.com",
    isInjection: false,
    explanation:
      "A standard email address alone is not enough to inject SQL into a properly built query.",
  },
  {
    id: 5,
    title: "Comment Cut-Off",
    text: "Username: admin'--  Password: (anything)",
    isInjection: true,
    explanation:
      "The single quote closes the string and the comment (--) cuts off the rest of the WHERE clause.",
  },
  {
    id: 6,
    title: "Numeric ID Lookup",
    text: "Account ID: 10492",
    isInjection: false,
    explanation:
      "A simple numeric ID value is normal as long as the query uses parameterized statements.",
  },
];

function Level3() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (id, choice) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: choice,
    }));
    setShowResults(false); 
  };

  const total = scenarios.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  const correctCount = scenarios.filter((scenario) => {
    const userAnswer = answers[scenario.id];
    if (!userAnswer) return false;
    const correctAnswer = scenario.isInjection ? "injection" : "safe";
    return userAnswer === correctAnswer;
  }).length;

  return (
    <div className="level-page-container">
      <header className="level-header">
        <h1 className="level-title">Level 3: SQL Injection Defense</h1>
        <p className="level-subtitle">
          An attacker is trying to break into the database. For each scenario,
          decide whether the input is <strong>Safe</strong> or an{" "}
          <strong>SQL Injection</strong>. Classify them all to lock down the
          system.
        </p>
      </header>

      <section className="cards-grid level3-grid">
        {scenarios.map((scenario) => {
          const userAnswer = answers[scenario.id];
          const correctAnswer = scenario.isInjection ? "injection" : "safe";
          const isCorrect = showResults && userAnswer === correctAnswer;

          return (
            <div
              key={scenario.id}
              className={`level-card ${
                showResults
                  ? isCorrect
                    ? "card-correct"
                    : "card-incorrect"
                  : ""
              }`}
            >
              <h2 className="level-card-title">{scenario.title}</h2>
              <p className="level-card-text">{scenario.text}</p>

              <div className="level-card-buttons">
                <button
                  type="button"
                  className={`choice-button ${
                    userAnswer === "safe" ? "choice-selected" : ""
                  }`}
                  onClick={() => handleAnswer(scenario.id, "safe")}
                >
                  Safe Input
                </button>
                <button
                  type="button"
                  className={`choice-button danger ${
                    userAnswer === "injection" ? "choice-selected" : ""
                  }`}
                  onClick={() => handleAnswer(scenario.id, "injection")}
                >
                  SQL Injection
                </button>
              </div>

              {showResults && (
                <p className="level-card-explanation">
                  {isCorrect ? "✅ Correct: " : "⚠️ Not quite: "}
                  {scenario.explanation}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="level-controls">
        <button
          type="button"
          className="primary-button"
          disabled={!allAnswered}
          onClick={() => setShowResults(true)}
        >
          {allAnswered ? "Check My Answers" : "Classify All Inputs First"}
        </button>

        {showResults && (
          <div className="results-panel">
            <h2>
              You got {correctCount} / {total} correct
            </h2>
            <p>
              Each correctly labeled injection is one more door closed to the
              attacker. When you use parameterized queries and validate inputs,
              these attacks become much harder.
            </p>
          </div>
        )}
      </section>

      <footer className="level-footer-nav">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/play")}
        >
          ⬅ Back to Escape Room
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(0)}
        >
          🔁 Replay Level
        </button>
      </footer>
    </div>
  );
}

export default Level3;
