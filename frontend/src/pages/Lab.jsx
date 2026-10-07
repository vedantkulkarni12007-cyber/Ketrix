
const Lab = () => {
  return (
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>FREE EXPERIMENTATION</div>
        <h1 style={{ fontSize: '3.5rem' }}>Quantum Lab</h1>
      </div>

      <div className="sci-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        
        <div style={{ backgroundColor: 'var(--bg-dark)', padding: '2rem', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div className="tech-label text-amber" style={{ marginBottom: '1rem' }}>CONSTRUCTION ZONE</div>
          <h2 style={{ marginBottom: '1rem' }}>Interactive Circuit Builder</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            The drag-and-drop quantum circuit construction interface is currently undergoing calibration.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Lab;
