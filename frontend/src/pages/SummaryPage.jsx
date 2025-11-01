import { useState } from 'react';
import { useCaseStore } from '../store';
import { useFallnummerData } from '../hooks/useFallnummerData';
import Plot from 'react-plotly.js';
import {
  ChevronDown,
  ChevronUp,
  Pill,
  FileText,
  Microscope,
  History,
  AlertCircle,
  BarChart3,
  Loader,
  Target,
  Heart,
} from 'lucide-react';
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
    secondaryDiagnoses: false,
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

  // Create staging data chart from current case
  const createStagingChart = () => {
    if (!apiData || !apiData.data) {
      return { data: [], layout: { title: 'No Data' } };
    }

    const stagingVariables = [
      { key: 'Staging clinic cT', label: 'Clinical cT', type: 'clinical' },
      { key: 'Staging Clinic N', label: 'Clinical cN', type: 'clinical' },
      { key: 'Staging Clinic M', label: 'Clinical cM', type: 'clinical' },
      { key: 'Staging Clinic UICC', label: 'Clinical UICC', type: 'clinical' },
      { key: 'Staging Path pT', label: 'Pathological pT', type: 'pathological' },
      { key: 'Staging Path N', label: 'Pathological pN', type: 'pathological' },
      { key: 'Staging Path M', label: 'Pathological pM', type: 'pathological' },
      { key: 'Staging Path UICC', label: 'Pathological UICC', type: 'pathological' },
    ];

    const labels = [];
    const values = [];
    const colors = [];

    stagingVariables.forEach((item) => {
      const value = apiData.data[item.key];
      if (value !== null && value !== undefined && value !== '') {
        labels.push(item.label);
        values.push(value);
        colors.push(item.type === 'clinical' ? '#1976d2' : '#d32f2f');
      }
    });

    return {
      data: [
        {
          x: labels,
          y: values,
          type: 'bar',
          marker: { color: colors },
          hovertemplate: '<b>%{x}</b><br>Stage: %{y}<extra></extra>',
          textposition: 'outside',
          text: values,
        },
      ],
      layout: {
        title: 'Tumor Staging Classification (TNM)',
        xaxis: { title: 'Staging Variables' },
        yaxis: { title: 'Stage Value' },
        hovermode: 'closest',
        margin: { l: 60, r: 40, t: 60, b: 120 },
        paper_bgcolor: '#f5f5f5',
        plot_bgcolor: '#ffffff',
        font: { size: 12 },
        height: 400,
        xaxis: {
          tickangle: -45,
        },
      },
    };
  };

  return (
    <div className="summary-container">
      <div className="summary-icon-box">
        <BarChart3 size={32} strokeWidth={1.5} />
      </div>
      <h2 className="summary-title">Current Reports</h2>
      
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
            <p className="card-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: apiData.data.curative === 1 ? '#2e7d32' : '#c62828' }}>
              {apiData.data.curative === 1 ? (
                <>
                  <Target size={18} /> Curative
                </>
              ) : (
                <>
                  <Heart size={18} /> Palliative
                </>
              )}
            </p>
          </div>
        )}

        {/* Palliative Connection Card */}
        {apiData && apiData.data && !loading && apiData.data.palliative === 1 && (
          <div className="summary-card card-palliative">
            <p className="card-label">Palliative Care</p>
            <p className="card-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: apiData.data['pall connection'] === 1 ? '#2e7d32' : '#f57c00' }}>
              {apiData.data['pall connection'] === 1 ? (
                <>
                  <Heart size={18} /> Connected
                </>
              ) : (
                <>
                  <AlertCircle size={18} /> Not Connected
                </>
              )}
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
            <p className="detail-value" style={{ color: '#1976d2', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader size={18} style={{ animation: 'spin 2s linear infinite' }} /> Loading case details...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="detail-item" style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '4px' }}>
            <p className="detail-value" style={{ color: '#c62828' }}>
              <AlertCircle size={18} style={{ marginRight: '0.5rem' }} /> Error loading data: {error}
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Pill size={20} style={{ color: '#1976d2' }} />
                  <span className="accordion-title">Therapy So Far / Bisher Therapie</span>
                </span>
                <span className="accordion-icon">
                  {expandedSections.therapySoFar ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={20} style={{ color: '#1976d2' }} />
                  <span className="accordion-title">Tumor Diagnosis / Tumordiagnose</span>
                </span>
                <span className="accordion-icon">
                  {expandedSections.tumorDiagnosis ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Microscope size={20} style={{ color: '#1976d2' }} />
                  <span className="accordion-title">Histo Cyto / Histo Zyto</span>
                </span>
                <span className="accordion-icon">
                  {expandedSections.histoCyto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <History size={20} style={{ color: '#1976d2' }} />
                  <span className="accordion-title">Tumor History / Tumoranamnese</span>
                </span>
                <span className="accordion-icon">
                  {expandedSections.tumorHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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

            {/* Secondary Diagnoses Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection('secondaryDiagnoses')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={20} style={{ color: '#1976d2' }} />
                  <span className="accordion-title">Secondary Diagnoses / Sekundärdiagnosen</span>
                </span>
                <span className="accordion-icon">
                  {expandedSections.secondaryDiagnoses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              {expandedSections.secondaryDiagnoses && (
                <div className="accordion-content">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                    {cleanText(apiData.data['Secondary diagnoses'])}
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

      {/* Staging Visualization Section */}
      <div className="staging-section">
        <div className="staging-section-header">
          <h3 className="staging-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart3 size={22} style={{ color: '#1565c0' }} />
            Tumor Staging Classification (TNM)
          </h3>
        </div>

        {apiData && apiData.data && !loading && (
          <div className="staging-chart-container">
            <Plot
              data={createStagingChart().data}
              layout={createStagingChart().layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {!apiData && !loading && !error && (
          <p style={{ textAlign: 'center', color: '#757575', fontStyle: 'italic' }}>
            No case selected. Select a case to view staging information.
          </p>
        )}
      </div>
    </div>
  );
}
