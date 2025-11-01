import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRAGQuery } from '../hooks/useRAGQuery';
import './RAGQueryPage.css';

export default function RAGQueryPage() {
  const [question, setQuestion] = useState('');
  const { answer, relevantChunks, loading, error, query } = useRAGQuery(3);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      query(question);
    }
  };

  return (
    <div className="rag-query-container">
      <div className="rag-header">
        <h1 className="rag-title">📚 Breast Cancer Guidelines Query</h1>
        <p className="rag-subtitle">Ask questions about S3 Guideline Breast Cancer recommendations</p>
      </div>

      {/* Query Form */}
      <div className="rag-query-section">
        <form onSubmit={handleQuerySubmit} className="query-form">
          <div className="form-group">
            <label htmlFor="question" className="form-label">Your Clinical Question</label>
            <textarea
              id="question"
              className="query-input"
              placeholder="E.g., What are the treatment options for triple-negative breast cancer? What is the recommended chemotherapy regimen for HER2-positive tumors?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !question.trim()}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching Guidelines...
              </>
            ) : (
              <>
                🔍 Query Guidelines
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-box">
          <h3 className="error-title">⚠️ Error</h3>
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Answer Section */}
      {answer && !loading && (
        <div className="answer-section">
          <h2 className="answer-title">🤖 AI Response</h2>
          <div className="answer-content">
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
              {answer}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Relevant Chunks */}
      {relevantChunks.length > 0 && !loading && (
        <div className="chunks-section">
          <h3 className="chunks-title">📋 Source Material (from S3 Guidelines)</h3>
          <div className="chunks-list">
            {relevantChunks.map((chunk, index) => (
              <div key={index} className="chunk-card">
                <div className="chunk-header">
                  <div className="chunk-ranking">
                    <span className="rank-badge">#{chunk.rank}</span>
                    <span className="chunk-number">Match #{chunk.rank} of {relevantChunks.length}</span>
                  </div>
                  <div className="chunk-metrics">
                    <span className="similarity-score">
                      {(chunk.similarity_percentage).toFixed(1)}%
                    </span>
                    <span className="similarity-label">Match Score</span>
                  </div>
                </div>
                <div className="similarity-bar">
                  <div className="similarity-fill" style={{width: `${chunk.similarity_percentage}%`}}></div>
                </div>
                <p className="chunk-text">{chunk.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!answer && !error && !loading && (
        <div className="empty-state">
          <p className="empty-message">
            💡 Ask a question about breast cancer diagnosis, staging, treatment options, or clinical recommendations based on the S3 Guideline.
          </p>
          <p className="empty-hint">
            Example questions:
            <br />• What are the treatment options for early-stage HER2-positive breast cancer?
            <br />• What is the recommended follow-up schedule after breast cancer treatment?
            <br />• What genetic testing is recommended for breast cancer?
          </p>
        </div>
      )}
    </div>
  );
}
