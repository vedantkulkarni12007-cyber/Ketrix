import { useState } from 'react';
import SimulatorLayout from './SimulatorLayout';
import SimulationRunner from '../lessons/components/SimulationRunner';
import CoreStateVisualizer from '../visualization/CoreStateVisualizer';
import BlochSphere from '../visualization/BlochSphere';

const SuperpositionExplorer = () => {
  const [shots, setShots] = useState(1000);
  const [simResult, setSimResult] = useState(null);

  const circuitDef = {
    num_qubits: 1,
    operations: [
      { gate: 'H', target: 0 }
    ],
    shots: shots,
    return_statevector: true
  };

  return (
    <SimulatorLayout 
      title="Superposition Explorer"
      desc="Apply the Hadamard gate (H) to a qubit initialized in the |0⟩ state to place it into an equal superposition. Observe how multiple possible states exist simultaneously before measurement."
    >
      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>CONCEPT</div>
        <p style={{ color: 'var(--text-secondary)' }}>
          A classical bit is always either 0 or 1. A quantum bit (qubit) can exist in a superposition of both states at the same time. The Hadamard (H) gate is the standard way to create an equal superposition: it transforms the basis state |0⟩ into the state |+⟩ = (|0⟩ + |1⟩) / √2.
        </p>
      </div>

      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>CONTROLS</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>CIRCUIT OPERATIONS</label>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)' }}>
              QUBIT 0: INITIALIZE |0⟩ &rarr; APPLY [H]
            </div>
          </div>
          
          <div>
            <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>SHOTS (MEASUREMENT REPEATS)</label>
            <select 
              value={shots} 
              onChange={(e) => { setShots(Number(e.target.value)); setSimResult(null); }}
              style={{ padding: '0.5rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--accent-blue)', width: '200px' }}
            >
              <option value={1}>1 shot (Single Measurement)</option>
              <option value={10}>10 shots</option>
              <option value={100}>100 shots</option>
              <option value={1000}>1,000 shots</option>
              <option value={8192}>8,192 shots</option>
            </select>
          </div>
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
              The <strong>Pre-Measurement Statevector</strong> shows the exact theoretical probabilities (50% for |0⟩ and 50% for |1⟩). 
              The <strong>Measurement Counts</strong> (above) show the actual statistical results of running the circuit {shots} times. 
              Notice how lower shot counts result in higher statistical variance from the theoretical 50/50 prediction.
            </p>
          </div>

          <CoreStateVisualizer 
            title="Pre-Measurement Statevector" 
            desc="The theoretical pure state of the qubit after applying the H gate, but before measurement collapses it."
            statevector={simResult.statevector} 
          />
          <BlochSphere 
            title="Bloch Sphere"
            description="The geometric representation of the |+⟩ state, lying exactly on the X-axis on the equator between |0⟩ and |1⟩."
            statevector={simResult.statevector} 
          />
        </div>
      )}
    </SimulatorLayout>
  );
};

export default SuperpositionExplorer;
