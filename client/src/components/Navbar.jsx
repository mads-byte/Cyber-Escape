import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

function Navbar() {
    return (
         <header className='header'>
            <nav className='nav'>
                <Link to="/" className="nav_logo">
                    CodeEscape
                </Link>

                <div className='nav_menu'>
                    <ul className='nav_list'>
                        <li className='nav_item'>
                            <Link to="/" className='nav_link'>
                                Home
                            </Link>
                        </li>

                        <li className='nav_item dropdown'>
                            <Link to="/play" className='nav_link'>
                                Escape Room
                            </Link>
                        </li>
                        <li className='nav_item'>
                            <Link to="/Login" className="nav_link">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}


export default Navbar