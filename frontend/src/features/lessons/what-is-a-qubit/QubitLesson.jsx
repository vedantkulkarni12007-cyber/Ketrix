import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const QubitLesson = () => {
  const [selectedState, setSelectedState] = useState('|0⟩');
  const [superpositionState, setSuperpositionState] = useState('|0⟩');
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    {
      question: "What is the classical equivalent of a qubit?",
      options: ["A transistor", "A byte", "A classical bit (0 or 1)", "A logic gate"],
      correctIdx: 2,
      explanation: "A qubit is the quantum analog to a classical bit. While a classical bit can only be 0 or 1, a qubit can be in a superposition of both."
    },
    {
      question: "What does the Hadamard (H) gate do to a qubit initially in the |0⟩ state?",
      options: ["Changes it to |1⟩", "Puts it into an equal superposition |+⟩", "Measures the qubit", "Destroys the qubit"],
      correctIdx: 1,
      explanation: "The H gate creates an equal superposition, often written as |+⟩, where there is a 50% probability of measuring 0 and a 50% probability of measuring 1."
    },
    {
      question: "Why might 1024 measurements of a superposition state not produce exactly 512 zeros and 512 ones?",
      options: ["Because the computer is broken", "Because quantum measurement is fundamentally probabilistic", "Because we need more qubits", "Because the H gate is imperfect"],
      correctIdx: 1,
      explanation: "Quantum measurement is probabilistic, much like flipping a fair coin 1024 times. You expect around 512 heads, but will rarely get exactly that number."
    }
  ];

  return (
    <LessonLayout expId="EXP-02" title="What is a Qubit?">
      
      {/* SECTION 01: LEARN */}
      <LessonSection number="01" title="Classical Bits vs Qubits">
        <ConceptPanel 
          leftContent={<>In classical computing, all information is processed using <strong>bits</strong>. A bit can only be in one of two states: <code>0</code> or <code>1</code>.</>}
          leftCode="CLASSICAL_BIT = [0, 1]"
          rightContent={<>In quantum computing, the basic unit of information is the <strong>qubit</strong> (quantum bit). We represent the basic states of a qubit using Dirac notation: <code>|0⟩</code> and <code>|1⟩</code>.</>}
          rightCode="QUBIT_STATE = α|0⟩ + β|1⟩"
        />
      </LessonSection>

      {/* SECTION 02: VISUALIZE */}
      <LessonSection number="02" title="Interactive Qubit State">
        <p style={{ marginBottom: '2rem' }}>
          Use the instrument controls below to prepare the state of the qubit. Observe how the probability distribution responds.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem' }}>
          {['|0⟩', '|1⟩', '|+⟩'].map(state => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              style={{
                backgroundColor: selectedState === state ? 'var(--bg-panel-light)' : 'transparent',
                borderColor: selectedState === state ? 'var(--accent-blue)' : 'var(--border-light)',
                color: selectedState === state ? 'var(--accent-blue)' : 'var(--text-secondary)'
              }}
            >
              PREPARE {state}
            </button>
          ))}
        </div>
        
        <StateVisualizer stateName={selectedState} />
      </LessonSection>

      {/* SECTION 03: EXPERIMENT */}
      <LessonSection number="03" title="Creating Superposition">
        <p style={{ marginBottom: '2rem' }}>
          To create a superposition, we apply a quantum gate. The <strong>Hadamard (H) gate</strong> puts a qubit initially in <code>|0⟩</code> into an equal superposition, known as the <code>|+⟩</code> state.
        </p>
        
        <div style={{ backgroundColor: 'var(--bg-dark)', padding: '3rem 2rem', border: '1px solid var(--border-light)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }} />
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <div className="text-mono" style={{ fontSize: '2rem', color: superpositionState === '|0⟩' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>|0⟩</div>
            <div style={{ height: '2px', width: '40px', backgroundColor: 'var(--border-light)' }}></div>
            <button 
              onClick={() => setSuperpositionState(superpositionState === '|0⟩' ? '|+⟩' : '|0⟩')}
              style={{ 
                width: '64px', height: '64px', 
                backgroundColor: superpositionState === '|+⟩' ? 'var(--bg-panel-light)' : 'var(--bg-panel)', 
                borderColor: superpositionState === '|+⟩' ? 'var(--accent-blue)' : 'var(--border-light)', 
                color: superpositionState === '|+⟩' ? 'var(--accent-blue)' : 'var(--text-primary)',
                fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
              }}
            >
              H
            </button>
            <div style={{ height: '2px', width: '40px', backgroundColor: superpositionState === '|+⟩' ? 'var(--accent-blue)' : 'var(--border-light)', transition: 'background-color 0.3s' }}></div>
            <div className="text-mono" style={{ fontSize: '2rem', color: superpositionState === '|+⟩' ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
              {superpositionState}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            {superpositionState === '|0⟩' 
              ? "STATUS: DETERMINISTIC STATE. WAITING FOR H GATE OPERATION." 
              : "STATUS: SUPERPOSITION ACHIEVED. P(0) ≈ 50%, P(1) ≈ 50%."}
          </div>
        </div>
      </LessonSection>

      {/* SECTION 04: SIMULATE */}
      <LessonSection number="04/05/06" title="Real Quantum Simulation">
        <p style={{ marginBottom: '2rem' }}>
          We will now dispatch this circuit to the <strong>Qiskit Aer</strong> simulator running on our backend server. It will apply the H gate and measure the qubit 1024 times.
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
            <div className="tech-label" style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>ANALYSIS OF MEASUREMENT RESULTS</div>
            <p>
              The Hadamard gate successfully placed the qubit into an equal superposition. When measured 1024 times, the simulator collapsed the wavefunction to state <code>0</code> exactly <span className="text-blue">{simResult.measurement_counts['0']}</span> times ({(simResult.measurement_counts['0']/1024 * 100).toFixed(1)}%), and state <code>1</code> exactly <span className="text-amber">{simResult.measurement_counts['1']}</span> times ({(simResult.measurement_counts['1']/1024 * 100).toFixed(1)}%).
            </p>
            <p style={{ marginBottom: 0 }}>
              Notice that the results are not exactly 512 and 512. This variance proves that quantum measurement is fundamentally probabilistic.
            </p>
          </div>
        )}
      </LessonSection>

      {/* SECTION 07: TEST */}
      <LessonSection number="07" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      {/* SECTION 08: CHALLENGE */}
      <LessonSection number="08" title="Prepare an Equal Superposition">
        <p style={{ marginBottom: '2rem' }}>
          Your task: Dispatch a circuit that results in an approximately 50/50 measurement distribution to prove you can operate the instrument.
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
              <div className="text-mono text-red">FAILED: DISTRIBUTION IS ASYMMETRIC. RECALIBRATE.</div>
            )}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? (
          <div>
            <div className="tech-label text-green" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              EXPERIMENT COMPLETE // LOGGED
            </div>
            <Link to="/learn/superposition">
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
            MARK EXPERIMENT COMPLETE
          </button>
        )}
      </div>

    </LessonLayout>
  );
};

export default QubitLesson;
