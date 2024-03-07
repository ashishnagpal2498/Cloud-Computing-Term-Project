import React, {useState} from 'react'
import '../../Stylesheets/header-nav.css'
import { Link } from 'react-router-dom';

export const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
  return (
        <nav className="top-nav">
          <div className="logo">Logo</div>
          <div className={`nav-options ${menuOpen ? 'open' : ''}`}>
            <ul className="menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/directory">Directory</Link></li>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
            </ul>
            <ul className="menu menu-auth">
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">SignUp</a></li>
            </ul>
            <button className={`cross-btn ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>&#x2715;</button>
          </div>
          <div className="menu-toggle" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </nav>
    );
}
