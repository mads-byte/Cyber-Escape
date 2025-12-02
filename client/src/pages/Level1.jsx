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
      prompt:
        "Hi, your paycheck couldn't be processed this cycle. Please log in here immediately to confirm your employee information: http://company-payroll-verify.com/update Failure to act within 12 hours will delay your payment.",
    },
    {
      prompt:
        "We attempted delivery today but couldn't reach you. Please schedule redelivery through the link below. (USPS Official Reminder) usps-delivery-help.net/reschedule",
    },
    {
      prompt:
        "Hey! I'm heading into a meeting. Can you grab a $200 Apple Gift Card for me and send the code? I'll reimburse you after.— Your Boss",
    },
    {
      prompt:
        "We detected unusual activity on your debit card ending in 8294. If this wasn't you, reply with your full name, card number, and ZIP code to verify your identity.",
    },
    {
      prompt:
        "Hello! Attached is your new benefits packet for 2025. This message is from HR. Let us know if you have any trouble opening it.",
    },
    {
      prompt:
        "Hi Max, your professor updated the syllabus and lecture times. The revised file is available in your student portal.",
    },
    { topic: "Payroll Issue" },
    { topic: "Your Package is Waiting" },
    { topic: "Quick Question" },
    { topic: "Bank Alert" },
    { topic: "Welcome to Your New Benefits Portal" },
    { topic: "Class Schedule Update" },
  ];

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardData]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
  };

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);

    // compare 2 selected cards
    useEffect(() => {
      if (choiceOne && choiceTwo) {
        if (
          (choiceOne.prompt && choiceTwo.topic) ||
          (choiceOne.topic && choiceTwo.prompt)
        ) {
          console.log("those mathch");
          resetTurn();
        } else {
          console.log("no match");
          resetTurn();
        }
      }
    }, [choiceOne, choiceTwo]);

    // reset choices & increase turn
    const resetTurn = () => {
      setChoiceOne(null);
      setChoiceTwo(null);
      setTurns((prevTurns) => prevTurns + 1);
    };
  };
  return (
    <div className="MatchGame">
      <h1>Level 1 Game</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard key={card.id} card={card} handleChoice={handleChoice} />
        ))}
      </div>
    </div>
  );
}
clearImmediate;

export default Level1;
