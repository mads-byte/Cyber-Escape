import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EscapeRoom from "./pages/EscapeRoom.jsx";
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
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
