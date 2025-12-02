import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EscapeRoom from "./pages/EscapeRoom.jsx";
import Level1 from "./pages/Level1.jsx";
import Level2 from "./pages/Level2.jsx";
import Level3 from "./pages/Level3.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/play" element={<EscapeRoom />} />
          <Route path="/level1" element={<Level1 />} />
          <Route path="/level2" element={<Level2 />} />
          <Route path="/level3" element={<Level3 />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
