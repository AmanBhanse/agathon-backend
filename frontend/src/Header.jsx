import { useState } from 'react';
import { useCaseStore } from './store';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const userName = useCaseStore((state) => state.userName);
  const logout = useCaseStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    window.location.reload();
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
    <header style={{
      width: '100%',
      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
      color: 'white',
      padding: '1.5rem 2rem',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
      fontSize: '1.8rem',
      fontWeight: '700',
      letterSpacing: '1px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🏥</span>
        
      </div>

      {/* Avatar with dropdown - only show when logged in */}
      {userName && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              border: '2px solid white',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              hover: {
                background: 'rgba(255, 255, 255, 0.35)',
              },
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.35)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
          >
            {getInitials(userName)}
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '60px',
              right: 0,
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
              minWidth: '200px',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid #e0e0e0',
                color: '#212121',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}>
                {userName}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: 'none',
                  background: 'none',
                  color: '#f44336',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.background = '#ffebee'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
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
