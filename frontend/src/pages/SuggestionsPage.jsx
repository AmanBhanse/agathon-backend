import { useCaseStore } from '../store';

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      maxWidth: '800px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
      padding: '3rem 2.5rem',
      margin: '2rem auto',
      animation: 'slideUp 0.3s ease-out',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        fontSize: '2rem',
      }}>
        💡
      </div>
      <h2 style={{
        color: '#1976d2',
        marginBottom: '0.5rem',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.5px',
      }}>Suggestions</h2>
      <p style={{
        color: '#757575',
        marginBottom: '2rem',
        fontSize: '0.95rem',
        textAlign: 'center',
      }}>Case #{caseNumber}</p>

      {/* Suggestions List */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {suggestionsList.map((suggestion) => (
          <div
            key={suggestion.id}
            style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(25, 118, 210, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <div style={{
                fontSize: '2rem',
                minWidth: '50px',
                textAlign: 'center',
              }}>
                {suggestion.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem',
                }}>
                  <h3 style={{
                    color: '#212121',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    margin: 0,
                  }}>
                    {suggestion.title}
                  </h3>
                  <span
                    style={{
                      background: getPriorityColor(suggestion.priority),
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {suggestion.priority}
                  </span>
                </div>
                <p style={{
                  color: '#757575',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  margin: 0,
                }}>
                  {suggestion.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{
        width: '100%',
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
      }}>
        <button
          style={{
            padding: '0.875rem 2rem',
            fontSize: '0.95rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 16px rgba(25, 118, 210, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Accept All
        </button>
        <button
          style={{
            padding: '0.875rem 2rem',
            fontSize: '0.95rem',
            borderRadius: '8px',
            border: '1px solid #1976d2',
            background: 'transparent',
            color: '#1976d2',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e3f2fd';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          Review Later
        </button>
      </div>
    </div>
  );
}
