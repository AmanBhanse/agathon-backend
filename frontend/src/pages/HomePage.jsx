import { useCaseStore } from '../store';
import './HomePage.css';

export default function HomePage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);

  return (
    <div className="home-container">
      <div className="success-icon-box">
        ✓
      </div>
      <h2 className="home-title">Welcome</h2>
      <p className="home-subtitle">You are logged in with Case Number:</p>
      <div className="case-number-display">{caseNumber}</div>
      <div className="info-box">
        ℹ️ Access to medical records and case documents
      </div>
    </div>
  );
}
