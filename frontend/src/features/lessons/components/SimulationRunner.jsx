import { useState } from 'react';
import { simulateCircuit } from '../../../services/quantumApi';

const SimulationRunner = ({ circuitDef, buttonText = "EXECUTE SIMULATION", onSimulationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runSim = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await simulateCircuit(circuitDef);
      setResult(data);
      if (onSimulationComplete) {
        onSimulationComplete(data);
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={runSim}
          disabled={loading}
          style={{ 
            borderColor: loading ? 'var(--border-light)' : 'var(--accent-blue)',
            color: loading ? 'var(--text-dim)' : 'var(--accent-blue)',
            width: '100%'
          }}
        >
          {loading ? 'TRANSMITTING CIRCUIT TO QISKIT AER...' : buttonText}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', backgroundColor: 'rgba(248, 113, 113, 0.1)', fontFamily: 'var(--font-mono)' }}>
          ERR: {error}
        </div>
      )}

      {result && (
        <div style={{ 
          backgroundColor: 'var(--bg-dark)', 
          border: '1px solid var(--border-light)',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div>
              <div className="tech-label">BACKEND ENGINE</div>
              <div className="text-mono">{result.metadata.simulator || 'AerSimulator'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="tech-label">SHOTS</div>
              <div className="text-mono">{result.metadata.shots}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {Object.keys(result.measurement_counts).sort().map((key, index) => {
              const count = result.measurement_counts[key];
              const percentage = ((count / result.metadata.shots) * 100).toFixed(1);
              const colors = ['var(--accent-blue)', 'var(--accent-amber)', '#8b5cf6', '#10b981'];
              const color = colors[index % colors.length];
              
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ color }}>STATE |{key}⟩</div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>COUNT: {String(count).padStart(4, '0')}</span>
                      <span style={{ color }}>{percentage.padStart(4, '0')}%</span>
                    </div>
                  </div>
                  <div style={{ height: '24px', backgroundColor: 'var(--bg-panel-light)', display: 'flex' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: color,
                      opacity: 0.8,
                      animation: 'growRight 0.8s ease-out forwards',
                      transformOrigin: 'left'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes growRight {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default SimulationRunner;
