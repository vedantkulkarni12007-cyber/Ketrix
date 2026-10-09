import { useState } from 'react';
import SimulatorLayout from './SimulatorLayout';
import SimulationRunner from '../lessons/components/SimulationRunner';
import CoreStateVisualizer from '../visualization/CoreStateVisualizer';

const QuantumInterference = () => {
  const [circuitMode, setCircuitMode] = useState('HH');
  const [simResult, setSimResult] = useState(null);

  const getOperations = () => {
    if (circuitMode === 'HH') {
      return [{ gate: 'H', target: 0 }, { gate: 'H', target: 0 }];
    } else {
      return [{ gate: 'H', target: 0 }, { gate: 'Z', target: 0 }, { gate: 'H', target: 0 }];
    }
  };

  const circuitDef = {
    num_qubits: 1,
    operations: getOperations(),
    shots: 1000,
    return_statevector: true
  };

  return (
    <SimulatorLayout 
      title="Quantum Interference"
      desc="Explore how complex probability amplitudes can cancel each other out (destructive interference) or reinforce each other (constructive interference)."
    >
      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>CONCEPT</div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Unlike classical probabilities (which are always positive numbers), quantum amplitudes can be negative or imaginary. 
          When a quantum system is in a superposition, different paths to the same outcome can add together. 
          If one path has a positive amplitude and another has a negative amplitude, they cancel out. This is <strong>destructive interference</strong>.
        </p>
      </div>

      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>SELECT INTERFERENCE CIRCUIT</div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => { setCircuitMode('HH'); setSimResult(null); }}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              backgroundColor: circuitMode === 'HH' ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-dark)', 
              color: circuitMode === 'HH' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              border: `1px solid ${circuitMode === 'HH' ? 'var(--accent-blue)' : 'var(--border-light)'}`
            }}
          >
            <div className="tech-label" style={{ marginBottom: '0.5rem' }}>CIRCUIT A: H &rarr; H</div>
            <div>Two Hadamards applied in sequence to |0⟩.</div>
          </button>
          
          <button 
            onClick={() => { setCircuitMode('HZH'); setSimResult(null); }}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              backgroundColor: circuitMode === 'HZH' ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-dark)', 
              color: circuitMode === 'HZH' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              border: `1px solid ${circuitMode === 'HZH' ? 'var(--accent-blue)' : 'var(--border-light)'}`
            }}
          >
            <div className="tech-label" style={{ marginBottom: '0.5rem' }}>CIRCUIT B: H &rarr; Z &rarr; H</div>
            <div>A phase flip (Z) inserted between two Hadamards.</div>
          </button>
        </div>
      </div>

      <div>
        <SimulationRunner 
          circuitDef={circuitDef} 
          onSimulationComplete={setSimResult} 
        />
      </div>

      {simResult && simResult.statevector && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="sci-panel">
            <div className="tech-label text-green" style={{ marginBottom: '1rem' }}>INTERPRETATION</div>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {circuitMode === 'HH' ? (
                <>
                  In Circuit A, the first H gate creates a superposition: (|0⟩ + |1⟩) / √2. 
                  The second H gate causes the paths leading to |1⟩ to destructively interfere (one path contributes a positive amplitude, the other a negative amplitude), resulting in a 0% probability of measuring 1. The paths leading to |0⟩ constructively interfere, returning the state perfectly to |0⟩.
                </>
              ) : (
                <>
                  In Circuit B, the first H gate creates (|0⟩ + |1⟩) / √2. The Z gate flips the sign of the |1⟩ amplitude, creating (|0⟩ - |1⟩) / √2.
                  Now, when the second H gate is applied, the negative phase causes the paths leading to |0⟩ to destructively interfere, while the paths leading to |1⟩ constructively interfere. The state perfectly transitions to |1⟩!
                </>
              )}
            </p>
          </div>

          <CoreStateVisualizer 
            title="Interfered Statevector" 
            desc="The final state after all interference effects have occurred."
            statevector={simResult.statevector} 
          />
        </div>
      )}
    </SimulatorLayout>
  );
};

export default QuantumInterference;
