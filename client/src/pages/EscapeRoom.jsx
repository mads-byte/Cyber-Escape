import "../styles/EscapeRoom.css";
import phishingImage from "/src/assets/phishing.jpg";
import sqlImage from "/src/assets/sql.jpg";
import securityImage from "/src/assets/security.jpg";

function EscapeRoom() {
  const rooms = [
    {
      title: "Phishing Email Simulator",
      image: phishingImage,
      description:
        "Analyze emails and decide whether each message is legitimate or a sneaky phishing attempt. Match them to the right category and uncover the truth!",
      greyBoxContent: "Level 1 | Beginner | 5 minutes",
    },
    {
      title: "Device Security Practices",
      image: securityImage,
      description:
        "Learn to identify unsafe device habits and pick up practical techniques for protecting your data and privacy.",
      greyBoxContent: "Level 2 | Intermediate | 7 minutes",
    },
    {
      title: "SQL Injection",
      image: sqlImage,
      description:
        "Explore how SQL injection works by testing vulnerable input fields and discovering how attackers manipulate databases.",
      greyBoxContent: "Level 3 | Advanced | 10 minutes",
    },
  ];

  return (
    <main>
      <h1 className="page-title">Online Escape Rooms</h1>

      {rooms.map((room, index) => (
        <section className="box-container" key={index}>
          <div className="box-image">
            <img src={room.image} alt={room.title} />
          </div>

          <div className="box-content">
            <h2 className="box-content-title">{room.title}</h2>
            <p className="box-content-description">{room.description}</p>
            <div className="grey-box">{room.greyBoxContent}</div>
            <button className="play-button">Play Now</button>
          </div>
        </section>
      ))}
    </main>
  );
}

export default EscapeRoom;
