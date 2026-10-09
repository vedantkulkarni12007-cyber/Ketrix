import { Link } from 'react-router-dom';

const SimulatorLayout = ({ title, desc, children }) => (
  <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1000px' }}>
    <Link to="/simulator" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
    >
      <span>&larr;</span> BACK TO PLAYGROUND
    </Link>
    
    <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
      <div className="tech-label text-blue" style={{ marginBottom: '1rem', letterSpacing: '0.2em' }}>SIMULATION ENVIRONMENT</div>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '800px', lineHeight: '1.6' }}>{desc}</p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {children}
    </div>
  </div>
);

export default SimulatorLayout;
