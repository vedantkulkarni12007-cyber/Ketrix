import { useState } from 'react';
import SimulatorLayout from './SimulatorLayout';
import SimulationRunner from '../lessons/components/SimulationRunner';
import CoreStateVisualizer from '../visualization/CoreStateVisualizer';

const EntanglementStudio = () => {
  const [bellState, setBellState] = useState('PhiPlus');
  const [simResult, setSimResult] = useState(null);

  const getOperations = () => {
    // Standard Bell states preparation
    const ops = [];
    if (bellState === 'PhiMinus' || bellState === 'PsiMinus') {
      ops.push({ gate: 'X', target: 0 }); // Flip Q0 to |1>
    }
    if (bellState === 'PsiPlus' || bellState === 'PsiMinus') {
      ops.push({ gate: 'X', target: 1 }); // Flip Q1 to |1>
    }
    
    // Core entangling sequence
    ops.push({ gate: 'H', target: 0 });
    ops.push({ gate: 'CX', control: 0, target: 1 });
    return ops;
  };

  const circuitDef = {
    num_qubits: 2,
    operations: getOperations(),
    shots: 1000,
    return_statevector: true
  };

  return (
    <SimulatorLayout 
      title="Entanglement Studio"
      desc="Create Bell states using a Hadamard and a CNOT gate to explore non-local quantum correlations."
    >
      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>CONCEPT</div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Entanglement occurs when the state of two or more qubits cannot be described independently of each other. 
          When we entangle two qubits, measuring one instantly determines the outcome of the other, no matter how far apart they are. 
          This is fundamentally different from classical correlation because the outcomes are not predetermined before measurement.
        </p>
      </div>

      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>SELECT BELL STATE</div>
        
        <select 
          value={bellState} 
          onChange={(e) => { setBellState(e.target.value); setSimResult(null); }}
          style={{ padding: '0.5rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--accent-blue)', width: '100%', marginBottom: '1rem' }}
        >
          <option value="PhiPlus">|Φ⁺⟩ = (|00⟩ + |11⟩) / √2</option>
          <option value="PhiMinus">|Φ⁻⟩ = (|00⟩ - |11⟩) / √2</option>
          <option value="PsiPlus">|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2</option>
          <option value="PsiMinus">|Ψ⁻⟩ = (|01⟩ - |10⟩) / √2</option>
        </select>

        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)' }}>
          {bellState === 'PhiPlus' && "CIRCUIT: INITIALIZE |00⟩ → H(q0) → CX(q0, q1)"}
          {bellState === 'PhiMinus' && "CIRCUIT: INITIALIZE |00⟩ → X(q0) → H(q0) → CX(q0, q1)"}
          {bellState === 'PsiPlus' && "CIRCUIT: INITIALIZE |00⟩ → X(q1) → H(q0) → CX(q0, q1)"}
          {bellState === 'PsiMinus' && "CIRCUIT: INITIALIZE |00⟩ → X(q0) → X(q1) → H(q0) → CX(q0, q1)"}
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
              Look at the measurement counts. You will see that only two of the four possible states (|00⟩, |01⟩, |10⟩, |11⟩) are ever measured. 
              If you measure qubit 0, you immediately know the state of qubit 1 with 100% certainty. 
              Because the qubits are fully entangled, they cannot be described by individual single-qubit Bloch Spheres. The state belongs to the combined system as a whole.
            </p>
          </div>

          <CoreStateVisualizer 
            title="Two-Qubit Statevector" 
            desc="The entangled complex amplitudes of the joint system."
            statevector={simResult.statevector} 
          />
        </div>
      )}
    </SimulatorLayout>
  );
};

export default EntanglementStudio;
