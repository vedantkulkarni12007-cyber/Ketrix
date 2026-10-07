
const STATE_MAP = {
  '|0⟩': { prob0: 100, prob1: 0, title: '|0⟩', desc: 'Deterministic State 0' },
  '|1⟩': { prob0: 0, prob1: 100, title: '|1⟩', desc: 'Deterministic State 1' },
  '|+⟩': { prob0: 50, prob1: 50, title: '|+⟩', desc: 'Equal Superposition' },
  '|-⟩': { prob0: 50, prob1: 50, title: '|-⟩', desc: 'Equal Superposition (Phase π)' },
  '|i⟩': { prob0: 50, prob1: 50, title: '|i⟩', desc: 'Equal Superposition (Phase π/2)' },
  '|-i⟩': { prob0: 50, prob1: 50, title: '|-i⟩', desc: 'Equal Superposition (Phase -π/2)' },
};

const StateVisualizer = ({ stateName }) => {
  const { prob0, prob1, title, desc } = STATE_MAP[stateName] || STATE_MAP['|0⟩'];

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
        <div className="text-mono" style={{ fontSize: '4rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(226, 232, 240, 0.2)' }}>
          {title}
        </div>
        <div className="tech-label" style={{ marginBottom: '4rem', color: 'var(--text-secondary)' }}>
          {desc}
        </div>
        
        {/* Probability Bars */}
        <div style={{ display: 'flex', gap: '4rem', width: '100%', maxWidth: '400px' }}>
          
          {/* P(0) */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div className="tech-label text-blue">P(0)</div>
              <div className="text-mono text-blue">{prob0}%</div>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-light)', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                width: `${prob0}%`,
                backgroundColor: 'var(--accent-blue)',
                boxShadow: '0 0 10px var(--accent-blue)',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>
          </div>

          {/* P(1) */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div className="tech-label text-amber">P(1)</div>
              <div className="text-mono text-amber">{prob1}%</div>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-light)', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                width: `${prob1}%`,
                backgroundColor: 'var(--accent-amber)',
                boxShadow: '0 0 10px var(--accent-amber)',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StateVisualizer;
