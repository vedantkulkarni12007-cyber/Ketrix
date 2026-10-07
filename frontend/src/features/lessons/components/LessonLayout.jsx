import { Link } from 'react-router-dom';

const LessonLayout = ({ expId, title, children }) => {
  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
        <span>&larr;</span> BACK TO CURRICULUM
      </Link>
      
      <div style={{ marginBottom: '4rem' }}>
        <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>
          {expId} // THEORETICAL FOUNDATIONS
        </div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {children}
      </div>
    </div>
  );
};

export default LessonLayout;
