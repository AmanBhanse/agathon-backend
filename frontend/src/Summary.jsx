import { useCaseStore } from './store';

export default function Summary() {
  const caseNumber = useCaseStore((state) => state.caseNumber);
  const userName = useCaseStore((state) => state.userName);

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
        background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        fontSize: '2rem',
      }}>
        📊
      </div>
      <h2 style={{
        color: '#1976d2',
        marginBottom: '2rem',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.5px',
      }}>Case Summary</h2>
      
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Case Number Card */}
        <div style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #90caf9',
        }}>
          <p style={{
            color: '#757575',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Case Number</p>
          <p style={{
            color: '#1976d2',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>{caseNumber}</p>
        </div>

        {/* User Name Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #ce93d8',
        }}>
          <p style={{
            color: '#757575',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Assigned To</p>
          <p style={{
            color: '#7b1fa2',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>{userName}</p>
        </div>

        {/* Status Card */}
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #81c784',
        }}>
          <p style={{
            color: '#757575',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Status</p>
          <p style={{
            color: '#388e3c',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>Active</p>
        </div>
      </div>

      {/* Details Section */}
      <div style={{
        width: '100%',
        background: '#fafafa',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
      }}>
        <h3 style={{
          color: '#212121',
          fontSize: '1.2rem',
          fontWeight: 600,
          marginBottom: '1rem',
        }}>Summary Details</h3>
        <p style={{
          color: '#757575',
          lineHeight: '1.6',
          marginBottom: '1rem',
        }}>
          This is the summary page for case <strong>{caseNumber}</strong> assigned to <strong>{userName}</strong>. 
          Here you can view detailed information about the case, its current status, and key metrics.
        </p>
        <ul style={{
          color: '#757575',
          lineHeight: '1.8',
          paddingLeft: '1.5rem',
        }}>
          <li>Total Tasks: 8</li>
          <li>Completed: 5</li>
          <li>In Progress: 2</li>
          <li>Pending: 1</li>
        </ul>
      </div>
    </div>
  );
}
