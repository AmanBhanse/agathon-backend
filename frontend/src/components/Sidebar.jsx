import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/app/home' },
    { id: 'reports', label: 'Reports', icon: '📊', path: '/app/summary' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡', path: '/app/suggestions' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sidebar-toggle"
        >
          {isOpen ? '◀' : '▶'}
        </button>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className="nav-item"
            >
              <span className="nav-icon">
                {item.icon}
              </span>
              {isOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
