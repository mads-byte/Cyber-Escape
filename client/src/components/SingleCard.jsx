import "../styles/SingleCard.css";

export default function SingleCard({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <p className={`front-card ${card.subject || ""}`}>{card.text}</p>
        <img
          className="back-card"
          src="src/assets/cover.jpg"
          onClick={handleClick}
          alt="card back"
        />
      </div>
    </div>
  );
}
