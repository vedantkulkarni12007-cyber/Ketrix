
const Challenges = () => {
  return (
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>KNOWLEDGE VERIFICATION</div>
        <h1 style={{ fontSize: '3.5rem' }}>Challenges</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {[1, 2, 3, 4].map(num => (
          <div key={num} className="sci-panel" style={{ opacity: 0.5 }}>
            <div className="tech-label text-dim" style={{ marginBottom: '1rem' }}>CHALLENGE-0{num} // LOCKED</div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>State Preparation {num}</h3>
            <div style={{ height: '2px', backgroundColor: 'var(--border-light)', marginBottom: '1rem' }}></div>
            <div className="text-mono text-dim" style={{ fontSize: '0.8rem' }}>REQUIRES LAB MODULE CALIBRATION</div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Challenges;
