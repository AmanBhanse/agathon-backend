import { useState, useEffect } from 'react';
import { useCaseStore } from '../store';
import { useFallnummerData } from '../hooks/useFallnummerData';
import './SuggestionsPage.css';

export default function SuggestionsPage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);
  const { data: apiData, loading, error } = useFallnummerData(caseNumber);
  const [suggestions, setSuggestions] = useState([]);

  // Generate suggestions based on case data
  useEffect(() => {
    if (!apiData || !apiData.data) return;

    const caseData = apiData.data;
    const generatedSuggestions = [];

    // Check for advanced staging
    const stagingN = parseInt(caseData['Staging Clinic N'] || '0');
    const stagingM = parseInt(caseData['Staging Clinic M'] || '0');
    if (stagingN >= 3 || stagingM >= 1) {
      generatedSuggestions.push({
        id: 1,
        title: 'Advanced Staging Detected',
        description: 'Patient presents with advanced lymph node involvement (N≥3) or distant metastases. Consider comprehensive multidisciplinary team consultation.',
        icon: '⚠️',
        priority: 'High',
      });
    }

    // Check palliative status
    if (caseData.palliative === 1 && caseData['pall connection'] === 0) {
      generatedSuggestions.push({
        id: 2,
        title: 'Palliative Care Connection Needed',
        description: 'Patient is classified for palliative treatment but is not yet connected to palliative care services. Initiate referral to palliative medicine team.',
        icon: '🤝',
        priority: 'High',
      });
    }

    // Check secondary diagnoses
    if (caseData['Secondary diagnoses'] && caseData['Secondary diagnoses'].length > 0) {
      generatedSuggestions.push({
        id: 3,
        title: 'Comorbidities Management',
        description: 'Patient has significant secondary diagnoses. Coordinate with relevant specialists to optimize overall treatment plan.',
        icon: '�',
        priority: 'Medium',
      });
    }

    // Check curative approach
    if (caseData.curative === 1) {
      generatedSuggestions.push({
        id: 4,
        title: 'Curative Treatment Planning',
        description: 'Patient is candidate for curative therapy. Schedule comprehensive treatment planning meeting with surgical, medical, and radiation oncology teams.',
        icon: '🎯',
        priority: 'High',
      });
    }

    // Add therapy recommendations
    if (caseData['therapy so far'] && caseData['therapy so far'].length > 0) {
      generatedSuggestions.push({
        id: 5,
        title: 'Review Prior Therapies',
        description: 'Patient has received prior therapeutic interventions. Review previous treatment responses and plan next steps accordingly.',
        icon: '�',
        priority: 'Medium',
      });
    } else {
      generatedSuggestions.push({
        id: 5,
        title: 'Initiate Treatment Plan',
        description: 'No prior therapies documented. Begin comprehensive treatment planning and baseline assessments.',
        icon: '▶️',
        priority: 'High',
      });
    }

    setSuggestions(generatedSuggestions);
  }, [apiData]);

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
      <h2 className="suggestions-title">Current Reports</h2>
      <p className="suggestions-case-info">Case #{caseNumber || 'N/A'}</p>

      {/* Loading State */}
      {loading && (
        <div className="suggestions-list">
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#1976d2', fontStyle: 'italic' }}>
              Loading case reports...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="suggestions-list">
          <div className="detail-item" style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '4px' }}>
            <p className="detail-value" style={{ color: '#c62828' }}>
              ⚠️ Error loading data: {error}
            </p>
          </div>
        </div>
      )}

      {/* No Case Selected */}
      {!caseNumber && !loading && (
        <div className="suggestions-list">
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#757575', fontStyle: 'italic' }}>
              No case selected. Please login to view reports.
            </p>
          </div>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && !error && suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Reports Generated */}
      {!loading && !error && suggestions.length === 0 && apiData && (
        <div className="suggestions-list">
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#757575', fontStyle: 'italic' }}>
              No reports generated for this case at this time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
