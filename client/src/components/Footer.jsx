import { NavLink } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
    return (
        <footer>
            <div>&copy; 2025 Company Name Inc. All rights reserved</div>
            <NavLink aria-label="see the company instagram account" to="https://www.instagram.com/">Instagram</NavLink>
            <NavLink aria-label="see the company twitter or X account " to="https://x.com/?lang=en">Twitter/X</NavLink>
        </footer>
    )
}


export default Footer