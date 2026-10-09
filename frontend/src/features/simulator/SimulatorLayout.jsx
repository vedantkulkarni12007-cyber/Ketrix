import { Link } from 'react-router-dom';

const SimulatorLayout = ({ title, desc, children }) => (
  <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1000px' }}>
    <Link to="/simulator" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
      <span>&larr;</span> BACK TO PLAYGROUND
    </Link>
    
    <div style={{ marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px' }}>{desc}</p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {children}
    </div>
  </div>
);

export default SimulatorLayout;
