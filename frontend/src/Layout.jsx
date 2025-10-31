import Header from './Header';

export default function Layout({ children }) {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
    }}>
      <Header />
      <main style={{ 
        flex: 1,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem',
      }}>
        {children}
      </main>
    </div>
  );
}
