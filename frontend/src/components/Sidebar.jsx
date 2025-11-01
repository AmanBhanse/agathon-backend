import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/app/home' },
    { id: 'reports', label: 'Reports', icon: '📊', path: '/app/summary' },
    { id: 'analysis', label: 'Analysis', icon: '💡', path: '/app/analysis' },
    { id: 'rag', label: 'Guidelines', icon: '📚', path: '/app/rag-query' },
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
