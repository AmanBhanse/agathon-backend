import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store';
import logo from '../assets/AGAPLESION_logo.svg';
import './Header.css';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const userName = useCaseStore((state) => state.userName);
  const logout = useCaseStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  // Generate avatar initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="AGAPLESION Logo" className="header-logo" />
        <span className="header-title">MedTech Team Portal</span>
      </div>

      {/* Avatar with dropdown - only show when logged in */}
      {userName && (
        <div className="avatar-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="avatar-button"
          >
            {getInitials(userName)}
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                {userName}
              </div>
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
