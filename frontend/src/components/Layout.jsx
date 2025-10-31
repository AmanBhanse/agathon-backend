import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
    }}>
      <Header />
      <div style={{
        display: 'flex',
        flex: 1,
      }}>
        <Sidebar />
        <main style={{ 
          flex: 1,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          padding: '2rem',
          overflow: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
