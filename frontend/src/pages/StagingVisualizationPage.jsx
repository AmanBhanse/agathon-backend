import { useStagingData } from '../hooks/useStagingData';
import Plot from 'react-plotly.js';
import './StagingVisualizationPage.css';

export default function StagingVisualizationPage() {
  const { stagingData, loading, error } = useStagingData();

  const createChartData = (stagingKey, title, xAxisTitle) => {
    if (!stagingData[stagingKey] || Object.keys(stagingData[stagingKey]).length === 0) {
      return {
        data: [],
        layout: {
          title: title,
          xaxis: { title: xAxisTitle },
          yaxis: { title: 'Frequency' },
          hovermode: 'closest',
        },
      };
    }

    // Sort keys for better visualization
    const sortedEntries = Object.entries(stagingData[stagingKey])
      .sort((a, b) => {
        // Custom sort for TNM staging
        const stageOrder = ['0', '1', '1a', '1b', '1c', '2', '2a', '2b', '3', '3a', '3b', '3c', '4', '4a', '4b', '+', '-', 'nan', 'NaN'];
        const aIndex = stageOrder.indexOf(a[0]);
        const bIndex = stageOrder.indexOf(b[0]);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        return b[1] - a[1]; // Otherwise sort by frequency
      });

    const labels = sortedEntries.map((entry) => entry[0]);
    const counts = sortedEntries.map((entry) => entry[1]);

    // Determine color based on chart type
    let color = '#1976d2';
    if (stagingKey.includes('clinic') || stagingKey.includes('Clinic')) {
      color = '#1976d2'; // Blue for clinical
    } else if (stagingKey.includes('Path')) {
      color = '#d32f2f'; // Red for pathological
    }

    return {
      data: [
        {
          x: labels,
          y: counts,
          type: 'bar',
          marker: { color: color },
          hovertemplate: '<b>%{x}</b><br>Count: %{y}<extra></extra>',
        },
      ],
      layout: {
        title: title,
        xaxis: { title: xAxisTitle },
        yaxis: { title: 'Frequency' },
        hovermode: 'closest',
        margin: { l: 60, r: 40, t: 60, b: 80 },
        paper_bgcolor: '#f5f5f5',
        plot_bgcolor: '#ffffff',
        font: { size: 12 },
      },
      config: { responsive: true, displayModeBar: true },
    };
  };

  // Prepare all chart data
  const charts = [
    {
      key: 'Staging clinic cT',
      title: 'Clinical T Stage (cT) - Primary Tumor Extent',
      xAxisTitle: 'Clinical T Stage',
    },
    {
      key: 'Staging Clinic N',
      title: 'Clinical N Stage (cN) - Regional Lymph Nodes',
      xAxisTitle: 'Clinical N Stage',
    },
    {
      key: 'Staging Clinic M',
      title: 'Clinical M Stage (cM) - Distant Metastases',
      xAxisTitle: 'Clinical M Stage',
    },
    {
      key: 'Staging Clinic UICC',
      title: 'Clinical UICC Stage - Overall Clinical Stage',
      xAxisTitle: 'Clinical UICC Stage',
    },
    {
      key: 'Staging Path pT',
      title: 'Pathological T Stage (pT) - Tumor Extent (Confirmed)',
      xAxisTitle: 'Pathological T Stage',
    },
    {
      key: 'Staging Path N',
      title: 'Pathological N Stage (pN) - Lymph Node Involvement (Confirmed)',
      xAxisTitle: 'Pathological N Stage',
    },
    {
      key: 'Staging Path M',
      title: 'Pathological M Stage (pM) - Distant Metastases (Confirmed)',
      xAxisTitle: 'Pathological M Stage',
    },
    {
      key: 'Staging Path UICC',
      title: 'Pathological UICC Stage - Final Stage Classification',
      xAxisTitle: 'Pathological UICC Stage',
    },
  ];

  if (loading) {
    return (
      <div className="staging-visualization-container">
        <div className="staging-loading">
          <p>Loading staging data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staging-visualization-container">
        <div className="staging-error">
          <p>Error loading staging data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staging-visualization-container">
      <div className="staging-header">
        <div className="staging-icon">📊</div>
        <h1 className="staging-title">Tumor Staging Distribution Analysis</h1>
        <p className="staging-description">
          TNM Classification Frequency Analysis - Clinical vs Pathological Staging
        </p>
      </div>

      {/* Clinical Staging Section */}
      <div className="staging-section">
        <div className="section-header clinical-header">
          <h2>Clinical Staging (Pre-treatment Assessment)</h2>
          <p className="section-description">
            Based on imaging, clinical examination, and endoscopic findings
          </p>
        </div>

        <div className="charts-grid">
          {charts.slice(0, 4).map((chart) => (
            <div key={chart.key} className="chart-container">
              <Plot
                data={createChartData(chart.key, chart.title, chart.xAxisTitle).data}
                layout={createChartData(chart.key, chart.title, chart.xAxisTitle).layout}
                config={{
                  responsive: true,
                  displayModeBar: false,
                  staticPlot: false,
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pathological Staging Section */}
      <div className="staging-section">
        <div className="section-header pathological-header">
          <h2>Pathological Staging (Post-treatment Confirmation)</h2>
          <p className="section-description">
            Based on histopathological examination after surgery
          </p>
        </div>

        <div className="charts-grid">
          {charts.slice(4, 8).map((chart) => (
            <div key={chart.key} className="chart-container">
              <Plot
                data={createChartData(chart.key, chart.title, chart.xAxisTitle).data}
                layout={createChartData(chart.key, chart.title, chart.xAxisTitle).layout}
                config={{
                  responsive: true,
                  displayModeBar: false,
                  staticPlot: false,
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Info */}
      <div className="staging-legend">
        <div className="legend-item">
          <span className="legend-marker clinical">■</span>
          <div>
            <strong>Clinical Staging (Blue)</strong>
            <p>cT: Clinical T stage | cN: Clinical N stage | cM: Clinical M stage | cUICC: Clinical UICC</p>
          </div>
        </div>
        <div className="legend-item">
          <span className="legend-marker pathological">■</span>
          <div>
            <strong>Pathological Staging (Red)</strong>
            <p>pT: Pathological T stage | pN: Pathological N stage | pM: Pathological M stage | pUICC: Pathological UICC</p>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="staging-info">
        <h3>TNM Classification Reference</h3>
        <ul>
          <li><strong>T (Tumor):</strong> Describes the extent of the primary tumor</li>
          <li><strong>N (Nodes):</strong> Describes regional lymph node involvement</li>
          <li><strong>M (Metastases):</strong> Indicates presence of distant metastases</li>
          <li><strong>UICC:</strong> Overall stage combining T, N, and M classifications</li>
        </ul>
      </div>
    </div>
  );
}
