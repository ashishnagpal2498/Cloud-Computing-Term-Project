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
          <div className="logo">Imagicon</div>
          <div className={`nav-options ${menuOpen ? 'open' : ''}`}>
            <ul className="menu">
              <li><Link to="/">Home</Link></li>
              {/* <li><Link to="/directory">Directory</Link></li> */}
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/friends">Friends</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              
            </ul>
            <ul className="menu menu-auth">
              <li><a href="https://springboot-trial.auth.us-east-1.amazoncognito.com/login?client_id=4rn99o5sdjhpann7ajk90e9mm7&response_type=code&scope=email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">Login</a></li>
              <li><a href="https://springboot-trial.auth.us-east-1.amazoncognito.com/signup?client_id=4rn99o5sdjhpann7ajk90e9mm7&response_type=code&scope=email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">SignUp</a></li>
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
