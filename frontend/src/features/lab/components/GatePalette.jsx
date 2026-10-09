const GatePalette = ({ selectedGate, onSelectGate }) => {
  const gates = [
    { id: 'H', label: 'H' },
    { id: 'X', label: 'X' },
    { id: 'Y', label: 'Y' },
    { id: 'Z', label: 'Z' },
    { id: 'CX', label: 'CX (2Q)' }
  ];

  return (
    <div className="sci-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div className="tech-label" style={{ marginBottom: '1rem' }}>GATES</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {gates.map(gate => {
          const isSelected = selectedGate === gate.id;
          return (
            <button
              key={gate.id}
              onClick={() => onSelectGate(isSelected ? null : gate.id)}
              style={{
                borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-light)',
                backgroundColor: isSelected ? 'var(--bg-panel-light)' : 'var(--bg-panel)',
                color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                minWidth: '60px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease-in-out',
                outline: 'none',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)'
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--text-dim)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-panel-light)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-panel)';
                }
              }}
            >
              {gate.label}
            </button>
          );
        })}
      </div>
      <div className="tech-label text-blue" style={{ marginTop: '1.5rem' }}>
        SELECTED TOOL: {selectedGate || 'NONE'}
      </div>
    </div>
  );
};

export default GatePalette;
