import { useState } from 'react';

export default function Sidebar({ currentPage, onPageChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'summary', label: 'Summary', icon: '📊' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
  ];

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? '250px' : '80px',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          padding: '1.5rem 1rem',
          minHeight: '100vh',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            padding: '0.75rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
        >
          {isOpen ? '◀' : '▶'}
        </button>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: currentPage === item.id ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                border: 'none',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: currentPage === item.id ? '600' : '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'left',
                borderLeft: currentPage === item.id ? '3px solid white' : '3px solid transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.5rem', minWidth: isOpen ? 'auto' : '24px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
