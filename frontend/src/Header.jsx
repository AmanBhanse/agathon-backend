export default function Header() {
  return (
    <header style={{
      width: '100%',
      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
      color: 'white',
      padding: '1.5rem 2rem',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
      fontSize: '1.8rem',
      fontWeight: '700',
      letterSpacing: '1px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🏥</span>
      MedTech Team Portal
    </header>
  );
}
