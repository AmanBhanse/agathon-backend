import { useCaseStore } from '../store';

export default function HomePage() {
  const caseNumber = useCaseStore((state) => state.caseNumber);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      maxWidth: '600px',
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
        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        fontSize: '2rem',
      }}>
        ✓
      </div>
      <h2 style={{
        color: '#1976d2',
        marginBottom: '1.5rem',
        fontWeight: 700,
        fontSize: '1.8rem',
        letterSpacing: '0.5px',
      }}>Welcome</h2>
      <p style={{
        fontSize: '1rem',
        color: '#757575',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>You are logged in with Case Number:</p>
      <div style={{
        fontWeight: 700,
        fontSize: '1.4rem',
        marginTop: '1rem',
        color: 'white',
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        padding: '1.25rem 1.75rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
        letterSpacing: '1px',
        minWidth: '250px',
        textAlign: 'center',
      }}>{caseNumber}</div>
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #1976d2',
        fontSize: '0.9rem',
        color: '#0d47a1',
        textAlign: 'center',
      }}>
        ℹ️ Access to medical records and case documents
      </div>
    </div>
  );
}
