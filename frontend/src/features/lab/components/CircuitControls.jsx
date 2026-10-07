
const CircuitControls = ({ numQubits, setNumQubits, shots, setShots, onClear }) => {
  const handleShotsChange = (e) => {
    const valStr = e.target.value;
    if (valStr === '') {
      setShots('');
      return;
    }
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;
    
    if (val > 10000) {
      setShots(10000);
    } else {
      setShots(val);
    }
  };

  const handleBlur = () => {
    if (shots === '' || shots < 1) {
      setShots(1);
    }
  };

  return (
    <div className="sci-panel" style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
        <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem' }}>QUBITS</label>
        <select 
          value={numQubits} 
          onChange={(e) => setNumQubits(parseInt(e.target.value, 10))}
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            padding: '0.5rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>
      
      <div>
        <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem' }}>SHOTS</label>
        <input 
          type="number" 
          value={shots}
          onChange={handleShotsChange}
          onBlur={handleBlur}
          min={1}
          max={10000}
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            padding: '0.5rem',
            fontFamily: 'var(--font-mono)',
            width: '100px'
          }}
        />
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <button 
          onClick={onClear}
          style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
        >
          CLEAR CIRCUIT
        </button>
      </div>
    </div>
  );
};

export default CircuitControls;
