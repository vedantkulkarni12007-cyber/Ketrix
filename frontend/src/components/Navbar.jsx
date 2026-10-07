import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'LEARN', path: '/learn' },
    { name: 'LAB', path: '/lab' },
    { name: 'CHALLENGES', path: '/challenges' },
    { name: 'SIMULATOR', path: '/simulator' },
    { name: 'DASHBOARD', path: '/dashboard' }
  ];

  return (
    <nav style={{
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px'
      }}>
        {/* Brand */}
        <Link to="/" style={{ 
          color: 'var(--text-primary)', 
          textDecoration: 'none', 
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ color: 'var(--accent-blue)' }}>Q_LEARN</span>
          <span style={{ color: 'var(--border-light)' }}>//</span>
          <span>LAB</span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {navLinks.map((link) => {
            // Determine if active. For /learn, match /learn and /learn/what-is-a-qubit
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);

            return (
              <Link 
                key={link.path} 
                to={link.path} 
                style={{
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem',
                  position: 'relative',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: '2px',
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 8px var(--accent-blue)'
                  }} />
                )}
                [{link.name}]
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
