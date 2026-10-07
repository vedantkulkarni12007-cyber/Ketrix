import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '4rem 0' }}>
        <Outlet />
      </main>
      <footer style={{ 
        padding: '2rem', 
        borderTop: '1px solid var(--border-light)', 
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        textAlign: 'center',
        letterSpacing: '0.05em'
      }}>
        <div>SYSTEM STATUS: ONLINE // QISKIT AER BACKEND: CONNECTED</div>
        <div style={{ marginTop: '0.5rem' }}>QUANTUM LEARNING PLATFORM v1.0.0</div>
      </footer>
    </div>
  );
};

export default Layout;
