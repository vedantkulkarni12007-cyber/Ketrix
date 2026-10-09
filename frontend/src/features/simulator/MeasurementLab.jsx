import { useState } from 'react';
import SimulatorLayout from './SimulatorLayout';
import SimulationRunner from '../lessons/components/SimulationRunner';
import CoreStateVisualizer from '../visualization/CoreStateVisualizer';

const MeasurementLab = () => {
  const [prepState, setPrepState] = useState('0');
  const [shots, setShots] = useState(10);
  const [simResult, setSimResult] = useState(null);

  const getOperations = () => {
    switch (prepState) {
      case '1': return [{ gate: 'X', target: 0 }];
      case '+': return [{ gate: 'H', target: 0 }];
      case '-': return [{ gate: 'X', target: 0 }, { gate: 'H', target: 0 }];
      case '0':
      default: return []; // Just |0>
    }
  };

  const circuitDef = {
    num_qubits: 1,
    operations: getOperations(),
    shots: shots,
    return_statevector: true
  };

  return (
    <SimulatorLayout 
      title="Measurement Lab"
      desc="Explore how quantum measurement destroys quantum information, forcing the qubit to probabilistically collapse into a classical state."
    >
      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>CONCEPT</div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Quantum mechanics is inherently probabilistic. When we measure a qubit in a superposition, we cannot predict exactly what the outcome will be. 
          We can only predict the <em>probability</em> of getting a 0 or a 1. This probability is given by the squared magnitude of the state's complex amplitude (Born's Rule).
        </p>
      </div>

      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>EXPERIMENT SETUP</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>1. PREPARE QUANTUM STATE</label>
            <select 
              value={prepState} 
              onChange={(e) => { setPrepState(e.target.value); setSimResult(null); }}
              style={{ padding: '0.5rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--accent-blue)', width: '100%' }}
            >
              <option value="0">|0⟩ (100% chance of 0)</option>
              <option value="1">|1⟩ (100% chance of 1)</option>
              <option value="+">|+⟩ (50% chance of 0, 50% chance of 1)</option>
              <option value="-">|-⟩ (50% chance of 0, 50% chance of 1, negative phase)</option>
            </select>
          </div>
          
          <div>
            <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>2. MEASUREMENT SHOTS</label>
            <select 
              value={shots} 
              onChange={(e) => { setShots(Number(e.target.value)); setSimResult(null); }}
              style={{ padding: '0.5rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--accent-blue)', width: '100%' }}
            >
              <option value={5}>5 shots (High statistical variance)</option>
              <option value={50}>50 shots</option>
              <option value={1000}>1,000 shots (Low statistical variance)</option>
              <option value={8192}>8,192 shots (Approaches theoretical limit)</option>
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
              The <strong>Pre-Measurement Statevector</strong> dictates the theoretical probabilities. 
              The <strong>Measurement Counts</strong> represent actual simulation sampling. 
              Because the measurement is probabilistic, 5 shots of a |+⟩ state rarely result in exactly 2.5 zeros and 2.5 ones. As you increase the shots to 8,192, the Law of Large Numbers forces the empirical distribution to converge closely to the theoretical prediction.
            </p>
          </div>

          <CoreStateVisualizer 
            title="Pre-Measurement Theoretical State" 
            desc="The state before measurement collapses it."
            statevector={simResult.statevector} 
          />
        </div>
      )}
    </SimulatorLayout>
  );
};

export default MeasurementLab;
