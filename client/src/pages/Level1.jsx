import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SingleCard from "../components/SingleCard.jsx";
import "../styles/Level1.css";

function Level1({ setCurrentLevel }) {
  const navigate = useNavigate();

  const handleFinish = () => {
    setCurrentLevel(2);
    navigate("/");
  };

  const cardData = [
    {
      text: "Hi, your paycheck couldn't be processed this cycle. Please log in here immediately to confirm your employee information: http://company-payroll-verify.com/update Failure to act within 12 hours will delay your payment.",
      pairID: 1,
      matched: false,
    },
    {
      text: "We attempted delivery today but couldn't reach you. Please schedule redelivery through the link below. (USPS Official Reminder) usps-delivery-help.net/reschedule",
      pairID: 2,
      matched: false,
    },
    {
      text: "Hey! Since the holidays are approaching, the company has decided to give $200-$400 Apple Gift cards to selected employees! You will receive a call to confirm that you have received the correct card. — The CEO",
      pairID: 3,
      matched: false,
    },
    {
      text: "We detected unusual activity on your debit card ending in 8294. If this wasn't you, reply with your full name, social security number, and ZIP code to verify your identity.",
      pairID: 4,
      matched: false,
    },
    {
      text: "Hello! Attached is your new benefits packet for 2025. This message is from HR. Let us know if you have any trouble opening it.",
      pairID: 5,
      matched: false,
    },
    {
      text: "Hey, you! This is your professor from college. Here is the required syllabus and material needed file. Please make sure to complete those by tonight to avoid withdrawal from class. Attachment: download.file.Signsyllabus _and_dowloadfile _TODAY.pdf",
      pairID: 6,
      matched: false,
    },
    { text: "Phishing Scam", pairID: 1, matched: false, subject: "topic" },
    { text: "Official Website", pairID: 2, matched: false, subject: "topic" },
    { text: "Gift Card Fraud", pairID: 3, matched: false, subject: "topic" },
    { text: "Bank Alert", pairID: 4, matched: false, subject: "topic" },
    { text: "Legitimate Email", pairID: 5, matched: false, subject: "topic" },
    {
      text: "Drive-by Download Attack",
      subject: "topic",
      pairID: 6,
      matched: false,
    },
  ];

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardData]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
  };

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // compare 2 selected cards for a match
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.pairID === choiceTwo.pairID) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.pairID === choiceOne.pairID) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // check if game is finished
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      handleFinish();
    }
  }, [cards]);

  // reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);
  };

  return (
    <div className="MatchGame">
      <h1>Level 1: Memory Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default Level1;
