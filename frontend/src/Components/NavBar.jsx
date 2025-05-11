import './NavBar.css';
import {Link} from 'react-router-dom';
import Button from './Button';
export default function NavBar(){
    return(
        <>
            <nav className="navbar">
                <div className="logo">
                <span className="material-icons">volunteer_activism</span>
                <span className="bridge">HungerBridge</span>
                </div>
                <ul className="nav-links">
                    <li><Link to = "/home">Home</Link></li>
                    <li><Link to = "/post">Post</Link></li>
                    <li><Link to = "/aboutus">AboutUs</Link></li>
                    <li><Link to = "/contact">ContactUs</Link></li>
                    <li><Button text="Log in" onClick={()=>{
                        console.log("HI i am trying to login.")
                    }}/></li>
                </ul>
            </nav>
        </>
    )
}