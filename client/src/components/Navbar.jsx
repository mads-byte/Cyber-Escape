import { Link } from 'react-router-dom';
import "../styles/Navbar.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { useRef, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    const boxRef = useRef(null);
    const { user, logout } = useContext(AuthContext);

    function toggle() {
        if (!boxRef.current.style.maxHeight || boxRef.current.style.maxHeight === "0px") {
            boxRef.current.style.maxHeight = "600px";
        } else {
            boxRef.current.style.maxHeight = "0px";
        }
    }

    return (
        <header className="header nav">

            <Link to="/" className="nav_logo">CodeEscape</Link>

            <button
                className="menu-icon"
                aria-label="Toggle menu"
                onClick={toggle}
            >
                <FontAwesomeIcon icon={faBars} />
            </button>

            <div
                className="nav_menu"
                ref={boxRef}
                style={{
                    maxHeight: "0px",
                    overflow: "hidden",
                    transition: "0.5s ease"
                }}
            >
                <ul className="nav_list">

                    {!user && (
                        <>
                            <li className="nav_item"><Link to="/" className="nav_link">Home</Link></li>
                            <li className="nav_item"><Link to="/play" className="nav_link">Escape Room</Link></li>
                            <li className="nav_item"><Link to="/login" className="nav_link">Login</Link></li>
                        </>
                    )}

                    {user?.accountType === "admin" && (
                        <>
                            <li className="nav_item"><Link to="/adminDashboard" className="nav_link">Dashboard</Link></li>
                            <li className="nav_item" onClick={logout}><Link to="/login" className="nav_link">Logout</Link></li>
                        </>
                    )}

                    {user?.accountType === "user" && (
                        <>
                            <li className="nav_item"><Link to="/" className="nav_link">Home</Link></li>
                            <li className="nav_item"><Link to="/play" className="nav_link">Escape Room</Link></li>
                            <li className="nav_item" onClick={logout}><Link to="/login" className="nav_link">Logout</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Navbar;
