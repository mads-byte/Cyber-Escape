import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EscapeRoom.css";

import phishingImage from "/src/assets/phishing.jpg";
import sqlImage from "/src/assets/sql.jpg";
import securityImage from "/src/assets/security.jpg";
import { motion, useInView, useAnimation } from 'framer-motion'

function EscapeRoom({ currentLevel, setCurrentLevel }) {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        duration: 2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0 }
  };

  const rooms = [
    {
      title: "Phishing Email Simulator",
      image: phishingImage,
      description:
        "Analyze emails and decide whether each message is legitimate or a sneaky phishing attempt. Match them to the right category and uncover the truth!",
      greyBoxContent: "Level 1 | Beginner | 3 minutes",
      route: "/level1",
      level: 1,
    },
    {
      title: "Device Security Practices",
      image: securityImage,
      description:
        "Learn to identify unsafe device habits and pick up practical techniques for protecting your data and privacy.",
      greyBoxContent: "Level 2 | Intermediate | 5 minutes",
      route: "/level2",
      level: 2,
    },
    {
      title: "SQL Injection",
      image: sqlImage,
      description:
        "Explore how SQL injection works by testing vulnerable input fields and discovering how attackers manipulate databases.",
      greyBoxContent: "Level 3 | Advanced | 7 minutes",
      route: "/level3",
      level: 3,
    },
  ];

  const handlePlayClick = (room) => {
    if (room.level > currentLevel) return;
    navigate(room.route);
  };

  return (
    <motion.main
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}>

      <h1 aria-label="Online Escape Rooms" className="page-title">Online Escape Rooms</h1>

      {rooms.map((room, index) => {
        const isLocked = room.level > currentLevel;

        return (
          <motion.section
            className={`box-container ${isLocked ? "locked" : ""}`}
            key={index}
            variants={item}
          >

            <div className="content-container">
              <div className="box-image">
                <img src={room.image} alt={room.title} />
              </div>

              <div className="box-content">
                <h2 className="box-content-title">{room.title}</h2>
                <p className="box-content-description">{room.description}</p>
                <div className="grey-box">{room.greyBoxContent}</div>

                <button
                  className="play-button"
                  disabled={isLocked}
                  onClick={() => handlePlayClick(room)}
                >
                  {isLocked ? "Locked" : "Play Now"}
                </button>
              </div>
            </div>
          </motion.section>
        );
      })}
    </motion.main>
  );
}

export default EscapeRoom;
