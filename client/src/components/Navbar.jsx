import { Link } from 'react-router-dom';
import "../styles/Navbar.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const { user, logout } = useContext(AuthContext)
    let navLinks
    if (!user) {
        navLinks = (
            <header className='header nav'>
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
                            <Link to="login" className="nav_link">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>

            </header>
        )
    } else if (user.accountType === 'admin') {
        navLinks = (
            <header className='header nav'>
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
                            <Link to="/adminDashboard" className='nav_link'>
                                Dashboard
                            </Link>
                        </li>
                        <li onClick={logout} className='nav_item'>
                            <Link to='/login' className="nav_link">
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>

            </header>
        )
    } else if (user.accountType === 'user') {
        navLinks = (
            <header className='header nav'>
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

                        <li onClick={logout} className='nav_item'>
                            <Link to='/login' className="nav_link">
                                Logout
                            </Link>
                        </li>

                    </ul>
                </div>

            </header>
        )
    }
    return (

        navLinks

    )
}


export default Navbar