import {Link,useNavigate} from 'react-router-dom';
import './Donornav.css'
export default function Donornav(){
    const navigate = useNavigate(); 

    const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
    return(
        <>
            <nav className="nav-bar">
                <div className="logo">
                <span className="material-icons">volunteer_activism</span>
                <span className="bridge">HungerBridge</span>
                </div>
                <div className="nav-links">
                <Link to="/donor-dashboard" className="donation-link">Dashboard</Link>
                <Link to="/requests" className="donation-link">Requests</Link>
                <button className="logout-button" onClick={handleLogout}>Logout</button>

                </div>
        </nav>
        </>
    );
}