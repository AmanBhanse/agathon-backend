import { useState } from 'react';
import { useCaseStore } from './store';

export default function Login({ onLogin }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!input.trim()) {
      setError('Please enter a case number');
      return;
    }
    useCaseStore.getState().setCaseNumber(input.trim());
    onLogin();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '420px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
      padding: '3rem 2.5rem',
      margin: '2rem auto',
      animation: 'slideUp 0.3s ease-out',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        fontSize: '2rem',
      }}>
        🔐
      </div>
      <h2 style={{
        color: '#1976d2',
        marginBottom: '0.5rem',
        fontWeight: 700,
        fontSize: '1.8rem',
        letterSpacing: '0.5px',
      }}>Login</h2>
      <p style={{
        color: '#757575',
        marginBottom: '2rem',
        fontSize: '0.95rem',
      }}>Enter your case number to access</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#212121',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>Case Number</label>
          <input
            type="text"
            placeholder="e.g., CASE-2024-001"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: error ? '2px solid #f44336' : '1px solid #e0e0e0',
              outline: 'none',
              background: '#fafafa',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
          />
          {error && <p style={{ color: '#f44336', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
        <button
          type="submit"
          style={{
            padding: '0.875rem 1.5rem',
            fontSize: '1.05rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)';
            e.target.style.boxShadow = '0 8px 24px rgba(25, 118, 210, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)';
            e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
