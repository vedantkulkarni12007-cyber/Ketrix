const CoreStateVisualizer = ({ title, desc, basisStates }) => {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-dark)', 
      border: '1px solid var(--border-light)', 
      position: 'relative'
    }}>
      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }} />
      
      <div style={{ position: 'relative', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Large State Display */}
        {title && (
          <div className="text-mono" style={{ fontSize: '4rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(226, 232, 240, 0.2)' }}>
            {title}
          </div>
        )}
        {desc && (
          <div className="tech-label" style={{ marginBottom: '4rem', color: 'var(--text-secondary)' }}>
            {desc}
          </div>
        )}
        
        {/* Probability Bars */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', width: '100%', maxWidth: '400px' }}>
          {basisStates.map((state, index) => {
            const colors = ['var(--accent-blue)', 'var(--accent-amber)', '#8b5cf6', '#10b981'];
            const color = colors[index % colors.length];

            return (
              <div key={state.label} style={{ flex: 1, minWidth: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div className="tech-label" style={{ color }}>P({state.label.replace(/[|⟩]/g, '')})</div>
                  <div className="text-mono" style={{ color }}>{state.probability}%</div>
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-light)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0,
                    width: `${state.probability}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}`,
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoreStateVisualizer;
