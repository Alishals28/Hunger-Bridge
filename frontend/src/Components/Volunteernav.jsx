import { Link, useNavigate } from 'react-router-dom';
import './Volunteernav.css';

export default function Volunteernav() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="nav-bar">
            <div className="logo">
                <span className="material-icons">volunteer_activism</span>
                <span className="bridge">HungerBridge</span>
            </div>
            <div className="nav-links">
                <Link to="/volunteer-dashboard" className="donation-link">Dashboard</Link>
                <Link to="/volunteer-post" className="donation-link">Posts</Link>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}
