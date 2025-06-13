import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import ThemeContext from '../Context/ThemeContext';

const Nav = () => {
    const { setJwt, role } = useContext(AppContext);
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    const navigate = useNavigate();

    const handleLogout = () => {
        setJwt("");
        localStorage.removeItem('jwt');
        navigate("/");
    };

    useEffect(() => {
        document.body.classList.remove('light-theme', 'vibrant-theme');
        document.body.classList.add(darkMode ? 'vibrant-theme' : 'light-theme');
    }, [darkMode]);

    return (
        <header>
            <nav className="navbar">
                <Link to="/"><button className="nav-button">Home</button></Link>
                {(role === 'HR' || role === 'ADMIN') && (
                    <Link to="/Operations"><button className="nav-button">Operations</button></Link>
                )}
                {role === "ADMIN" && (
                    <>
                        <Link to="/Admin"><button className="nav-button">Admin</button></Link>
                        <Link to="/Department"><button className="nav-button">Department</button></Link>
                    </>
                )}
                <button className="nav-button logout" onClick={handleLogout}>Logout</button>

                <button
                    className="nav-button toggle-theme"
                    onClick={() => setDarkMode(prev => !prev)}
                >
                    {darkMode ? '🌙 Vibrant' : '☀️ Light'}
                </button>
            </nav>
        </header>
    );
};

export default Nav;
