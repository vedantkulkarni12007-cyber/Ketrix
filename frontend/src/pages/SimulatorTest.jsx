import { useState } from 'react';
import { simulateCircuit } from '../services/quantumApi';

const SimulatorTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const circuit = {
      num_qubits: 1,
      operations: [
        { gate: 'H', target: 0 }
      ],
      shots: 1024
    };

    try {
      const data = await simulateCircuit(circuit);
      setResult(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>SYSTEM DIAGNOSTIC</div>
        <h1 style={{ fontSize: '3rem' }}>Quantum Simulator Test</h1>
      </div>
      
      <div className="sci-panel" style={{ marginBottom: '2rem' }}>
        <div className="tech-label" style={{ marginBottom: '1.5rem' }}>TEST: 1-QUBIT CIRCUIT</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          This will apply a Hadamard (H) gate to Qubit 0 and measure it 1024 times.
        </p>
        
        <button 
          onClick={handleSimulate} 
          disabled={loading}
          style={{ width: '100%', borderColor: loading ? 'var(--border-light)' : 'var(--accent-blue)', color: loading ? 'var(--text-dim)' : 'var(--accent-blue)' }}
        >
          {loading ? 'INITIATING QISKIT AER SIMULATION...' : 'EXECUTE SIMULATION'}
        </button>
      </div>

      {error && (
        <div className="sci-panel" style={{ borderColor: 'var(--accent-red)', backgroundColor: 'rgba(248, 113, 113, 0.05)', marginBottom: '2rem' }}>
          <div className="tech-label text-red" style={{ marginBottom: '1rem' }}>ERROR</div>
          <div className="text-mono text-red">{error}</div>
        </div>
      )}

      {result && (
        <div className="sci-panel" style={{ borderColor: 'var(--accent-green)', backgroundColor: 'rgba(52, 211, 153, 0.05)' }}>
          <div className="tech-label text-green" style={{ marginBottom: '1.5rem' }}>SIMULATION RESULT: SUCCESS</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>MEASUREMENT COUNTS</div>
              <pre className="text-mono" style={{ backgroundColor: 'var(--bg-dark)', padding: '1rem', border: '1px solid var(--border-light)', margin: 0, color: 'var(--text-primary)' }}>
                {JSON.stringify(result.measurement_counts, null, 2)}
              </pre>
            </div>
            
            <div>
              <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>METADATA</div>
              <pre className="text-mono" style={{ backgroundColor: 'var(--bg-dark)', padding: '1rem', border: '1px solid var(--border-light)', margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(result.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatorTest;
