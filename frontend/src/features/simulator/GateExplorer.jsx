import { useState } from 'react';
import SimulatorLayout from './SimulatorLayout';
import SimulationRunner from '../lessons/components/SimulationRunner';
import CoreStateVisualizer from '../visualization/CoreStateVisualizer';
import BlochSphere from '../visualization/BlochSphere';

const GateExplorer = () => {
  const [sequence, setSequence] = useState([]);
  const [simResult, setSimResult] = useState(null);

  const addGate = (gate) => {
    if (sequence.length < 6) {
      setSequence([...sequence, gate]);
      setSimResult(null);
    }
  };

  const clearSequence = () => {
    setSequence([]);
    setSimResult(null);
  };

  const circuitDef = {
    num_qubits: 1,
    operations: sequence.map(g => ({ gate: g, target: 0 })),
    shots: 1000,
    return_statevector: true
  };

  return (
    <SimulatorLayout 
      title="Quantum Gate Explorer"
      desc="Apply single-qubit rotations (H, X, Y, Z) and visualize how they manipulate the statevector phase and probabilities."
    >
      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>CONCEPT</div>
        <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', margin: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>X Gate:</strong> Bit-flip. Rotates state around the X-axis (swaps probabilities of |0⟩ and |1⟩).</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Z Gate:</strong> Phase-flip. Rotates around the Z-axis. Applies a relative phase of -1 to |1⟩ without changing its probability.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Y Gate:</strong> Both bit-flip and phase-flip, with an imaginary component. Rotates around the Y-axis.</li>
          <li><strong>H Gate:</strong> Hadamard. Rotates from the Z-basis to the X-basis, creating superpositions.</li>
        </ul>
      </div>

      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>SEQUENCE BUILDER (MAX 6)</div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {['H', 'X', 'Y', 'Z'].map(g => (
            <button key={g} onClick={() => addGate(g)} disabled={sequence.length >= 6}
                    style={{ padding: '0.5rem 1.5rem', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)' }}>
              ADD [{g}]
            </button>
          ))}
          <button onClick={clearSequence} style={{ padding: '0.5rem 1.5rem', backgroundColor: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border-light)', marginLeft: 'auto' }}>
            CLEAR
          </button>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', minHeight: '60px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-dim)' }}>|0⟩ &rarr;</span>
          {sequence.length === 0 ? (
            <span style={{ color: 'var(--text-dim)' }}>[ NO GATES APPLIED ]</span>
          ) : (
            sequence.map((g, i) => (
              <span key={i} style={{ padding: '0.2rem 0.8rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)' }}>{g}</span>
            ))
          )}
          {sequence.length > 0 && <span style={{ color: 'var(--text-dim)' }}>&rarr; MEASURE</span>}
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
              Notice that applying a Z gate directly to |0⟩ has no observable effect on measurement probabilities, because the Z gate only affects the relative phase of |1⟩. 
              However, applying Z to a state in superposition (e.g., after an H gate) will flip its relative phase, visibly moving it to the opposite side of the Bloch sphere.
            </p>
          </div>

          <CoreStateVisualizer 
            title="Final Statevector" 
            desc="The resulting theoretical amplitudes after applying your sequence."
            statevector={simResult.statevector} 
          />
          <BlochSphere 
            title="Final Bloch Sphere"
            description="The resulting geometric state on the sphere."
            statevector={simResult.statevector} 
          />
        </div>
      )}
    </SimulatorLayout>
  );
};

export default GateExplorer;
