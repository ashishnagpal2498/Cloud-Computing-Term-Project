import React, {useState} from 'react'
import '../../Stylesheets/header-nav.css'

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
              <li><a href="#">Home</a></li>
              <li><a href="#">Directory</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
            <ul className="menu menu-auth">
              <li><a href="#">Login</a></li>
              <li><a href="#">SignUp</a></li>
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
