import "../styles/SingleCard.css";

export default function SingleCard({ card, handleChoice }) {
  const handleClick = () => {
    handleChoice(card);
  };

  return (
    <div className="card">
      <div>
        <div className="front-card">
          {card.prompt && <p className="prompt">{card.prompt}</p>}
          {card.topic && <p className="topic">{card.topic}</p>}
        </div>
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
