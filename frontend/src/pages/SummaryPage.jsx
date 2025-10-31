import { useCaseStore } from '../store';
import './SummaryPage.css';

export default function SummaryPage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);
  const userName = useCaseStore((state) => state.userName);

  return (
    <div className="summary-container">
      <div className="summary-icon-box">
        📊
      </div>
      <h2 className="summary-title">Case Summary</h2>
      
      <div className="summary-cards-grid">
        {/* Case Number Card */}
        <div className="summary-card card-case-number">
          <p className="card-label">Case Number</p>
          <p className="card-value">{caseNumber}</p>
        </div>

        {/* User Name Card */}
        <div className="summary-card card-user-name">
          <p className="card-label">Assigned To</p>
          <p className="card-value">{userName}</p>
        </div>

        {/* Status Card */}
        <div className="summary-card card-status">
          <p className="card-label">Status</p>
          <p className="card-value">Active</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="summary-details-section">
        <h3 className="summary-details-title">Summary Details</h3>
        <div className="detail-item">
          <p className="detail-value">
            This is the summary page for case <strong>{caseNumber}</strong> assigned to <strong>{userName}</strong>. 
            Here you can view detailed information about the case, its current status, and key metrics.
          </p>
        </div>
        <div className="detail-item">
          <ul style={{ color: '#757575', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
            <li>Total Tasks: 8</li>
            <li>Completed: 5</li>
            <li>In Progress: 2</li>
            <li>Pending: 1</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
