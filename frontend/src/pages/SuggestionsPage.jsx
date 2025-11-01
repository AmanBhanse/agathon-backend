import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useCaseStore } from '../store';
import { useFallnummerData } from '../hooks/useFallnummerData';
import { useCombinedReport } from '../hooks/useCombinedReport';
import './SuggestionsPage.css';

export default function SuggestionsPage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);
  const { data: apiData, loading: fallnummerLoading, error: fallnummerError } = useFallnummerData(caseNumber);
  const [forceRefresh, setForceRefresh] = useState(false);
  const { report, loading: reportLoading, error: reportError, isCached } = useCombinedReport(caseNumber, apiData?.data, forceRefresh);
  const [suggestions, setSuggestions] = useState([]);

  // Handle regenerate button click
  const handleRegenerateReport = () => {
    setForceRefresh(true);
    // Reset after use
    setTimeout(() => setForceRefresh(false), 0);
  };

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
      {(fallnummerLoading || reportLoading) && (
        <div className="suggestions-list">
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#1976d2', fontStyle: 'italic' }}>
              {reportLoading ? 'Generating AI clinical report...' : 'Loading case data...'}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {(fallnummerError || reportError) && (
        <div className="suggestions-list">
          <div className="detail-item" style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '4px' }}>
            <p className="detail-value" style={{ color: '#c62828' }}>
              ⚠️ Error: {fallnummerError || reportError}
            </p>
          </div>
        </div>
      )}

      {/* No Case Selected */}
      {!caseNumber && !fallnummerLoading && (
        <div className="suggestions-list">
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#757575', fontStyle: 'italic' }}>
              No case selected. Please login to view reports.
            </p>
          </div>
        </div>
      )}

      {/* AI-Generated Clinical Report Section */}
      {!fallnummerLoading && !reportLoading && report && !reportError && (
        <div className="ai-report-section">
          <div className="ai-report-header">
            <div className="ai-report-title-group">
              <h3 className="ai-report-title">🤖 AI Clinical Summary</h3>
              <span className="ai-badge">AI Generated</span>
              {isCached && <span className="cache-badge">📦 Cached</span>}
            </div>
            <button 
              className="regenerate-btn"
              onClick={handleRegenerateReport}
              disabled={reportLoading}
              title="Regenerate report from AI"
            >
              🔄 Regenerate
            </button>
          </div>
          <div className="ai-report-content">
            <div className="markdown-content">
              <ReactMarkdown 
                components={{
                  h2: ({node, ...props}) => <h2 style={{color: '#1976d2', marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}} {...props} />,
                  h3: ({node, ...props}) => <h3 style={{color: '#424242', marginTop: '0.8rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: '600'}} {...props} />,
                  p: ({node, ...props}) => <p style={{color: '#424242', lineHeight: '1.8', marginBottom: '0.8rem', fontSize: '0.95rem'}} {...props} />,
                  ul: ({node, ...props}) => <ul style={{marginLeft: '1.5rem', marginBottom: '0.8rem', color: '#424242'}} {...props} />,
                  ol: ({node, ...props}) => <ol style={{marginLeft: '1.5rem', marginBottom: '0.8rem', color: '#424242'}} {...props} />,
                  li: ({node, ...props}) => <li style={{marginBottom: '0.4rem', lineHeight: '1.6'}} {...props} />,
                  strong: ({node, ...props}) => <strong style={{fontWeight: '700', color: '#1976d2'}} {...props} />,
                  em: ({node, ...props}) => <em style={{fontStyle: 'italic', color: '#757575'}} {...props} />,
                  code: ({node, ...props}) => <code style={{backgroundColor: '#f5f5f5', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', color: '#d32f2f'}} {...props} />,
                  blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '4px solid #1976d2', paddingLeft: '1rem', marginLeft: '0', marginRight: '0', color: '#757575', fontStyle: 'italic'}} {...props} />,
                }}
              >
                {report.clinical_report}
              </ReactMarkdown>
            </div>
            <div className="report-meta">
              <small style={{ color: '#999' }}>
                Generated: {new Date(report.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions List (as secondary info) */}
      {!fallnummerLoading && !reportLoading && suggestions.length > 0 && (
        <div className="suggestions-section">
          <h3 className="suggestions-subtitle">📋 Clinical Recommendations</h3>
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
        </div>
      )}

      {/* No Data Available */}
      {!fallnummerLoading && !reportLoading && !report && !reportError && apiData && (
        <div className="suggestions-list">
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#757575', fontStyle: 'italic' }}>
              No report available for this case at this time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
