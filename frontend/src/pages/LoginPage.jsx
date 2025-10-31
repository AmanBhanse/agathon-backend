import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store';
import './LoginPage.css';

export default function LoginPage() {
  const [caseNumber, setCaseNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('case');
  const navigate = useNavigate();

  const handleCaseSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!caseNumber.trim()) {
      setError('Please enter a case number');
      return;
    }
    useCaseStore.getState().setCaseNumber(caseNumber.trim());
    setStep('name');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    useCaseStore.getState().setUserName(userName.trim());
    navigate('/app/home');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon-box">
          🔐
        </div>
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">
          {step === 'case' ? 'Enter your case number to access' : 'Enter your name to proceed'}
        </p>
        
        {step === 'case' ? (
          <form onSubmit={handleCaseSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Case Number</label>
              <input
                type="text"
                placeholder="e.g., CASE-2024-001"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="form-input"
                style={{ borderColor: error ? '#f44336' : '#e0e0e0' }}
              />
              {error && <p className="form-error">{error}</p>}
            </div>
            <button
              type="submit"
              className="form-button"
            >
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={handleNameSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                placeholder="e.g., John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="form-input"
                style={{ borderColor: error ? '#f44336' : '#e0e0e0' }}
              />
              {error && <p className="form-error">{error}</p>}
            </div>
            <button
              type="submit"
              className="form-button"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('case');
                setError('');
              }}
              className="form-button"
              style={{
                background: 'transparent',
                color: '#1976d2',
                border: '1px solid #1976d2',
              }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
