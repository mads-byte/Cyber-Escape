import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    return (
        <navbar>
            <NavLink aria-label="see the company instagram account" to="/">Home</NavLink>
            <NavLink aria-label="see the company twitter or X account " to="/login">Login</NavLink>
        </navbar>
    )
}


export default Navbar