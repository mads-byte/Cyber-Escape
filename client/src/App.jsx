import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import EscapeRoom from "./pages/EscapeRoom.jsx";
import Level1 from "./pages/Level1.jsx";
import Level2 from "./pages/Level2.jsx";
import Level3 from "./pages/Level3.jsx";
import Footer from "./components/Footer.jsx";
import { useState } from "react";

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/play"
            element={
              <EscapeRoom
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route
            path="/level1"
            element={<Level1 setCurrentLevel={setCurrentLevel} />}
          />
          <Route
            path="/level2"
            element={
              <Level2
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
            }
          />
          <Route
            path="/level3"
            element={<Level3 currentLevel={currentLevel} />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
