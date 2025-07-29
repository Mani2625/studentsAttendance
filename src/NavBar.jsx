import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="navbar">
            <button className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                &#9776; {/* Hamburger icon */}
            </button>
            <ul className={isMenuOpen ? 'open' : ''}>
                <li>
                    <NavLink to="/" end
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mark-attendance"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Mark Attendance
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/sra"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        SRA
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/warden"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Warden
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/add-student"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Add Student
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default NavBar;
