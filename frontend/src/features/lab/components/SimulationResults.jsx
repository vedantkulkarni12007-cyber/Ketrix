const SimulationResults = ({ result }) => {
  if (!result) return null;

  const { num_qubits, measurement_counts, metadata } = result;
  const actualShots = metadata?.shots || 1000;

  const numStates = Math.pow(2, num_qubits);
  const basisStates = [];
  for (let i = 0; i < numStates; i++) {
    const binaryStr = i.toString(2).padStart(num_qubits, '0');
    basisStates.push(binaryStr);
  }

  const maxCount = Math.max(...Object.values(measurement_counts), 0) || actualShots;

  return (
    <div className="sci-panel" style={{ marginTop: '2rem' }}>
      <div className="tech-label text-amber" style={{ marginBottom: '1.5rem' }}>MEASUREMENT RESULTS</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {basisStates.map(state => {
          const count = measurement_counts[state] || 0;
          const probability = count / actualShots;
          const percentage = (probability * 100).toFixed(1);
          
          const isDominant = count > 0 && count === maxCount;

          const maxBlocks = 20;
          const numBlocks = Math.round(probability * maxBlocks);
          const barString = '█'.repeat(numBlocks).padEnd(maxBlocks, ' ');

          return (
            <div key={state} style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)' }}>
              <div style={{ width: '60px', color: isDominant ? 'var(--accent-blue)' : 'var(--text-primary)', fontWeight: isDominant ? 'bold' : 'normal' }}>|{state}⟩</div>
              <div style={{ color: count > 0 ? (isDominant ? 'var(--accent-blue)' : 'var(--border-active)') : 'var(--border-light)', marginRight: '1rem', whiteSpace: 'pre' }}>
                {barString}
              </div>
              <div style={{ width: '80px', textAlign: 'right', color: count > 0 ? (isDominant ? 'var(--accent-green)' : 'var(--text-primary)') : 'var(--text-dim)', fontWeight: isDominant ? 'bold' : 'normal' }}>
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="tech-label" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', color: 'var(--text-secondary)' }}>
        SHOTS: {actualShots}
      </div>
    </div>
  );
};

export default SimulationResults;
