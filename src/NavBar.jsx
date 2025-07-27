import { NavLink } from 'react-router-dom';

function NavBar() {
    return (
        <div className="navbar">
            <ul>
                <li>
                    <NavLink to="/" end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mark-attendance"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Mark Attendance
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/sra"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        SRA
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/warden"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Warden
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/add-student"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Add Student
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default NavBar;
