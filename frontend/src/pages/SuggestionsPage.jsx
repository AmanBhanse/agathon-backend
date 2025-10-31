import { useCaseStore } from '../store';
import './SuggestionsPage.css';

export default function SuggestionsPage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);

  const suggestionsList = [
    {
      id: 1,
      title: 'Prioritize Follow-up',
      description: 'Consider reaching out to the client for additional information to expedite resolution.',
      icon: '⚡',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Review Documentation',
      description: 'Update case documentation with latest findings from the investigation phase.',
      icon: '📝',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Schedule Team Meeting',
      description: 'Organize a team sync to discuss potential solutions and share insights.',
      icon: '👥',
      priority: 'Medium',
    },
    {
      id: 4,
      title: 'External Consultation',
      description: 'Consider involving subject matter experts for specialized insights.',
      icon: '🔍',
      priority: 'Low',
    },
  ];

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-icon-box">
        💡
      </div>
      <h2 className="suggestions-title">Suggestions</h2>
      <p className="suggestions-case-info">Case #{caseNumber}</p>

      {/* Suggestions List */}
      <div className="suggestions-list">
        {suggestionsList.map((suggestion) => (
          <div key={suggestion.id} className="suggestion-card">
            <div className="suggestion-icon">
              {suggestion.icon}
            </div>
            <div className="suggestion-content">
              <div className="suggestion-header">
                <h3 className="suggestion-title">{suggestion.title}</h3>
                <span className={`priority-badge ${getPriorityClass(suggestion.priority)}`}>
                  {suggestion.priority}
                </span>
              </div>
              <p className="suggestion-description">
                {suggestion.description}
              </p>
              <div className="suggestion-actions">
                <button className="suggestion-button">View Details</button>
                <button className="suggestion-button primary">Accept</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="suggestions-footer">
        <button className="footer-button primary">
          Accept All
        </button>
        <button className="footer-button secondary">
          Review Later
        </button>
      </div>
    </div>
  );
}
