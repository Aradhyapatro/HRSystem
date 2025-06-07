import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppContext from '../Context/AppContext'

const Nav = () => {
    const { setJwt, role } = useContext(AppContext);
    const navigate = useNavigate()
    const handleLogout = () => {
        setJwt("")
        localStorage.removeItem('jwt')
        navigate("/")
    }

    return (
        <header>
            <nav className="navbar">
                <Link to={`/`}><button className="nav-button">Home</button></Link>
                {(role === 'HR' || role === 'ADMIN') && <Link to={`/Operations`}><button className="nav-button">Operations</button></Link>}
                {role === "ADMIN" && <Link to={`/Admin`}><button className="nav-button">Admin</button></Link>}
                {role === "ADMIN" && <Link to={`/Department`}><button className="nav-button">Department</button></Link>}
                <button className="nav-button logout" onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    )
}

export default Nav
