import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const ClassicalVsQuantumLesson = () => {
  const [bitState, setBitState] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [experimentState, setExperimentState] = useState('|0⟩');

  const quizQuestions = [
    {
      question: "What is a classical bit?",
      options: ["0 or 1", "α|0⟩ + β|1⟩", "A quantum gate"],
      correctIdx: 0,
      explanation: "A classical bit can only be strictly 0 or strictly 1. It cannot be in a superposition of both."
    },
    {
      question: "What does the Hadamard (H) gate do to |0⟩?",
      options: ["Always produces |1⟩", "Produces an equal superposition", "Measures the qubit"],
      correctIdx: 1,
      explanation: "The H gate creates an equal superposition of |0⟩ and |1⟩, often denoted as |+⟩."
    },
    {
      question: "After creating an equal superposition and measuring many times, what should we expect?",
      options: ["Always 0", "Always 1", "Approximately 50% 0 and 50% 1"],
      correctIdx: 2,
      explanation: "Quantum measurement is probabilistic. An equal superposition will collapse to 0 half the time and 1 half the time."
    }
  ];

  return (
    <LessonLayout expId="EXP-01" title="Classical vs Quantum Computing">
      
      {/* SECTION 01: LEARN */}
      <LessonSection number="01" title="Learn">
        <p style={{ marginBottom: '2rem' }}>
          Welcome to the Quantum Laboratory. Before constructing quantum circuits, we must understand the fundamental difference between classical information and quantum information.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Classical Box */}
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>CLASSICAL BIT</h3>
            <p>
              A <strong>bit</strong> is the basic unit of classical information. It has exactly two possible values: <code>0</code> or <code>1</code>.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="tech-label" style={{ marginBottom: '0.5rem' }}>BIT STATE</div>
              <div style={{ 
                width: '100px', height: '100px', 
                border: '2px solid var(--text-secondary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', fontFamily: 'var(--font-mono)'
              }}>
                {bitState}
              </div>
              <button 
                onClick={() => setBitState(b => b === 0 ? 1 : 0)}
                style={{ marginTop: '1rem' }}
              >
                TOGGLE STATE
              </button>
            </div>
          </div>

          {/* Quantum Box */}
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>QUBIT</h3>
            <p>
              A <strong>qubit</strong> (quantum bit) is the basic unit of quantum information. Its basis states are written using Dirac notation as <code>|0⟩</code> and <code>|1⟩</code>.
            </p>
            <p>A quantum state can be represented as a combination (superposition) of basis states:</p>
            <div className="text-mono text-blue" style={{ fontSize: '1.5rem', textAlign: 'center', margin: '1rem 0' }}>
              |ψ⟩ = α|0⟩ + β|1⟩
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Here, α and β are <strong>amplitudes</strong>. Their squared magnitudes determine measurement probabilities: <br/>
              <code>P(0) = |α|²</code> and <code>P(1) = |β|²</code>, where <code>|α|² + |β|² = 1</code>.
            </p>
          </div>
        </div>
      </LessonSection>

      {/* SECTION 02: COMPARE */}
      <LessonSection number="02" title="Compare">
        <ConceptPanel 
          leftTitle="CLASSICAL INSTRUMENT PANEL"
          leftContent="A classical computer operates deterministically on discrete states. It evaluates logic gates against absolute 0s and 1s."
          leftCode="POSSIBLE STATES: {0, 1}"
          rightTitle="QUANTUM INSTRUMENT PANEL"
          rightContent="Quantum advantage comes from exploiting quantum states, interference, and entanglement. A quantum computer does NOT simply 'try every answer simultaneously'—it orchestrates probabilities so the correct answer becomes highly likely upon measurement."
          rightCode="GENERAL STATE: α|0⟩ + β|1⟩"
        />
      </LessonSection>

      {/* SECTION 03: VISUALIZE */}
      <LessonSection number="03" title="Visualize">
        <p style={{ marginBottom: '2rem' }}>
          Below is a mathematical visualization of a qubit. Initially, it rests in the <code>|0⟩</code> state. 
          When we apply a <strong>Hadamard (H) gate</strong>, we mathematically transform it into an equal superposition.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem' }}>
          <button
            onClick={() => setExperimentState('|0⟩')}
            style={{
              backgroundColor: experimentState === '|0⟩' ? 'var(--bg-panel-light)' : 'transparent',
              borderColor: experimentState === '|0⟩' ? 'var(--accent-blue)' : 'var(--border-light)',
              color: experimentState === '|0⟩' ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
          >
            RESET TO |0⟩
          </button>
          <button
            onClick={() => setExperimentState('|+⟩')}
            style={{
              backgroundColor: experimentState === '|+⟩' ? 'var(--bg-panel-light)' : 'transparent',
              borderColor: experimentState === '|+⟩' ? 'var(--accent-blue)' : 'var(--border-light)',
              color: experimentState === '|+⟩' ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
          >
            APPLY H
          </button>
        </div>
        
        <StateVisualizer stateName={experimentState} />
        
        <div className="tech-label text-dim" style={{ marginTop: '1rem', textAlign: 'center' }}>
          NOTE: THIS IS A THEORETICAL VISUALIZATION, NOT A SIMULATION.
        </div>
      </LessonSection>

      {/* SECTION 04: EXPERIMENT */}
      <LessonSection number="04" title="Experiment">
        <p style={{ marginBottom: '2rem' }}>
          Let's design the circuit for this operation. We place a single qubit on a wire and apply the H gate.
        </p>
        
        <div style={{ backgroundColor: 'var(--bg-dark)', padding: '3rem 2rem', border: '1px solid var(--border-light)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }} />
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <div className="text-mono" style={{ fontSize: '2rem', color: experimentState === '|0⟩' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>q0</div>
            <div style={{ height: '2px', width: '40px', backgroundColor: 'var(--border-light)' }}></div>
            
            <div style={{ 
              width: '64px', height: '64px', 
              backgroundColor: experimentState === '|+⟩' ? 'var(--bg-panel-light)' : 'var(--bg-panel)', 
              borderColor: experimentState === '|+⟩' ? 'var(--accent-blue)' : 'var(--border-light)', 
              border: '1px solid',
              color: experimentState === '|+⟩' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {experimentState === '|+⟩' ? 'H' : ''}
            </div>
            
            <div style={{ height: '2px', width: '40px', backgroundColor: experimentState === '|+⟩' ? 'var(--accent-blue)' : 'var(--border-light)', transition: 'background-color 0.3s' }}></div>
            
            <div className="text-mono" style={{ fontSize: '2rem', color: experimentState === '|+⟩' ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
              {experimentState === '|0⟩' ? '|0⟩' : '|+⟩'}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            CONCEPTUAL STATE TRANSITION
          </div>
        </div>
      </LessonSection>

      {/* SECTION 05/06: SIMULATE & OBSERVE */}
      <LessonSection number="05 / 06" title="Simulate & Observe">
        <p style={{ marginBottom: '2rem' }}>
          We will now construct this exact circuit and dispatch it to the <strong>Qiskit Aer</strong> simulator. The backend will execute the H gate and perform 1024 measurements.
        </p>
        
        <SimulationRunner 
          circuitDef={{
            num_qubits: 1,
            operations: [{ gate: 'H', target: 0 }],
            shots: 1024
          }}
          onSimulationComplete={setSimResult}
        />

        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <div className="tech-label" style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>OBSERVATION LOG</div>
            <p>
              The simulation returned exactly <span className="text-blue">{simResult.measurement_counts['0']}</span> counts of state <code>0</code> ({(simResult.measurement_counts['0']/1024 * 100).toFixed(1)}%), and <span className="text-amber">{simResult.measurement_counts['1']}</span> counts of state <code>1</code> ({(simResult.measurement_counts['1']/1024 * 100).toFixed(1)}%).
            </p>
            <p style={{ marginBottom: 0 }}>
              Because quantum measurement is fundamentally probabilistic, executing the identical circuit again will likely yield slightly different counts. This statistical fluctuation is expected and normal for finite sample sizes.
            </p>
          </div>
        )}
      </LessonSection>

      {/* SECTION 07: TEST */}
      <LessonSection number="07" title="Test">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      {/* SECTION 08: CHALLENGE */}
      <LessonSection number="08" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>
          <strong>MISSION:</strong> Prove your understanding of the H gate. Dispatch a circuit that creates an equal superposition and observe the resulting 50/50 measurement distribution.
        </p>
        
        <SimulationRunner 
          buttonText="DISPATCH CHALLENGE CIRCUIT"
          circuitDef={{
            num_qubits: 1,
            operations: [{ gate: 'H', target: 0 }],
            shots: 1024
          }}
          onSimulationComplete={setChallengeResult}
        />

        {challengeResult && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            backgroundColor: challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
            border: `1px solid ${challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400 ? 'var(--accent-green)' : 'var(--accent-red)'}`
          }}>
            <div className="tech-label" style={{ color: challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400 ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400 ? (
              <div className="text-mono text-green">SUCCESS: 50/50 DISTRIBUTION ACHIEVED.</div>
            ) : (
              <div className="text-mono text-red">FAILED: DISTRIBUTION IS ASYMMETRIC.</div>
            )}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? (
          <div>
            <div className="tech-label text-green" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              MODULE COMPLETE // LOGGED
            </div>
            <Link to="/learn/what-is-a-qubit">
              <button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)', borderColor: 'var(--accent-blue)' }}>
                INITIATE NEXT EXPERIMENT &rarr;
              </button>
            </Link>
          </div>
        ) : (
          <button 
            onClick={() => setLessonComplete(true)}
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
          >
            MARK MODULE COMPLETE
          </button>
        )}
      </div>

    </LessonLayout>
  );
};

export default ClassicalVsQuantumLesson;
