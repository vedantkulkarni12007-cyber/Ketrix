
const Dashboard = () => {
  return (
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>USER TELEMETRY</div>
        <h1 style={{ fontSize: '3.5rem' }}>Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        <div className="sci-panel">
          <div className="tech-label" style={{ marginBottom: '1rem' }}>MODULES COMPLETED</div>
          <div className="text-mono" style={{ fontSize: '3rem', color: 'var(--accent-blue)' }}>01<span style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>/12</span></div>
        </div>
        
        <div className="sci-panel">
          <div className="tech-label" style={{ marginBottom: '1rem' }}>CIRCUITS EXECUTED</div>
          <div className="text-mono" style={{ fontSize: '3rem', color: 'var(--accent-amber)' }}>--</div>
        </div>
        
        <div className="sci-panel">
          <div className="tech-label" style={{ marginBottom: '1rem' }}>MASTERY SCORE</div>
          <div className="text-mono" style={{ fontSize: '3rem', color: 'var(--accent-green)' }}>--</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
