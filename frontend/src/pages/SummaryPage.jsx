import { useState } from 'react';
import { useCaseStore } from '../store';
import { useFallnummerData } from '../hooks/useFallnummerData';
import './SummaryPage.css';

export default function SummaryPage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);
  const userName = useCaseStore((state) => state.userName);
  
  // State for accordion expansion
  const [expandedSections, setExpandedSections] = useState({
    therapySoFar: false,
    tumorDiagnosis: false,
    histoCyto: false,
    tumorHistory: false,
  });
  
  // Fetch fallnummer data from API
  const { data: apiData, loading, error } = useFallnummerData(caseNumber);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Extract clean text by removing formatting escape sequences
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/\\f:[0-9]+\\|\\f:-\\/g, '')
      .replace(/\\m[01]\\/g, '')
      .replace(/\\\\/g, '\n')
      .trim();
  };

  return (
    <div className="summary-container">
      <div className="summary-icon-box">
        📊
      </div>
      <h2 className="summary-title">Case Summary</h2>
      
      <div className="summary-cards-grid">
        {/* Case Number Card */}
        <div className="summary-card card-case-number">
          <p className="card-label">Fallnummer</p>
          <p className="card-value">{caseNumber || '-'}</p>
        </div>

        {/* User Name Card */}
        <div className="summary-card card-user-name">
          <p className="card-label">Assigned To</p>
          <p className="card-value">{userName || '-'}</p>
        </div>

        

        {/* Treatment Approach Card */}
        {apiData && apiData.data && !loading && (
          <div className="summary-card card-treatment">
            <p className="card-label">Treatment Approach</p>
            <p className="card-value" style={{ color: apiData.data.curative === 1 ? '#2e7d32' : '#c62828' }}>
              {apiData.data.curative === 1 ? '🎯 Curative' : '🤝 Palliative'}
            </p>
          </div>
        )}

        {/* Palliative Connection Card */}
        {apiData && apiData.data && !loading && apiData.data.palliative === 1 && (
          <div className="summary-card card-palliative">
            <p className="card-label">Palliative Care</p>
            <p className="card-value" style={{ color: apiData.data['pall connection'] === 1 ? '#2e7d32' : '#f57c00' }}>
              {apiData.data['pall connection'] === 1 ? '✓ Connected' : '⚠️ Not Connected'}
            </p>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="summary-details-section">
        <h3 className="summary-details-title">Summary Details</h3>

        {/* Loading State */}
        {loading && (
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#1976d2', fontStyle: 'italic' }}>
              Loading case details...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="detail-item" style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '4px' }}>
            <p className="detail-value" style={{ color: '#c62828' }}>
              ⚠️ Error loading data: {error}
            </p>
          </div>
        )}

        {/* API Data Display */}
        {apiData && apiData.data && !loading && (
          <>
            {/* Therapy So Far Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection('therapySoFar')}
              >
                <span className="accordion-title">Therapy So Far</span>
                <span className="accordion-icon">
                  {expandedSections.therapySoFar ? '▼' : '▶'}
                </span>
              </button>
              {expandedSections.therapySoFar && (
                <div className="accordion-content">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                    {cleanText(apiData.data['therapy so far'])}
                  </p>
                </div>
              )}
            </div>

            {/* Tumor Diagnosis Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection('tumorDiagnosis')}
              >
                <span className="accordion-title">Tumor Diagnosis</span>
                <span className="accordion-icon">
                  {expandedSections.tumorDiagnosis ? '▼' : '▶'}
                </span>
              </button>
              {expandedSections.tumorDiagnosis && (
                <div className="accordion-content">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                    {cleanText(apiData.data['Tumor diagnosis'])}
                  </p>
                </div>
              )}
            </div>

            {/* Histo Cyto Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection('histoCyto')}
              >
                <span className="accordion-title">Histo Cyto</span>
                <span className="accordion-icon">
                  {expandedSections.histoCyto ? '▼' : '▶'}
                </span>
              </button>
              {expandedSections.histoCyto && (
                <div className="accordion-content">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                    {cleanText(apiData.data['Histo Cyto'])}
                  </p>
                </div>
              )}
            </div>

            {/* Tumor History Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection('tumorHistory')}
              >
                <span className="accordion-title">Tumor History</span>
                <span className="accordion-icon">
                  {expandedSections.tumorHistory ? '▼' : '▶'}
                </span>
              </button>
              {expandedSections.tumorHistory && (
                <div className="accordion-content">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                    {cleanText(apiData.data['Tumor history'])}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* No Data State */}
        {!apiData && !loading && !error && (
          <div className="detail-item">
            <p className="detail-value" style={{ color: '#757575', fontStyle: 'italic' }}>
              No case selected. Please login to view details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
