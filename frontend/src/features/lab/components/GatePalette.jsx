const GatePalette = ({ selectedGate, onSelectGate }) => {
  const gates = ['H', 'X', 'Y', 'Z', 'CX'];

  return (
    <div className="sci-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div className="tech-label" style={{ marginBottom: '1rem' }}>GATES</div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {gates.map(gate => (
          <button
            key={gate}
            onClick={() => onSelectGate(selectedGate === gate ? null : gate)}
            style={{
              borderColor: selectedGate === gate ? 'var(--accent-blue)' : 'var(--border-light)',
              backgroundColor: selectedGate === gate ? 'var(--bg-panel-light)' : 'var(--bg-panel)',
              color: selectedGate === gate ? 'var(--accent-blue)' : 'var(--text-primary)',
              minWidth: '60px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {gate}
          </button>
        ))}
      </div>
      <div className="tech-label text-blue" style={{ marginTop: '1.5rem' }}>
        SELECTED TOOL: {selectedGate || 'NONE'}
      </div>
    </div>
  );
};

export default GatePalette;
