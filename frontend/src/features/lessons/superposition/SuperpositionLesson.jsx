import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const SuperpositionLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    {
      question: "What does it mean for a qubit to be in superposition?",
      options: ["It is spinning faster", "It exists in a linear combination of |0⟩ and |1⟩", "It has been measured", "It is broken"],
      correctIdx: 1,
      explanation: "Superposition means the quantum state is a combination (superposition) of the basis states |0⟩ and |1⟩, carrying a probability amplitude for each."
    },
    {
      question: "What happens when you measure a qubit in superposition?",
      options: ["The superposition collapses to a single definite state", "It remains in superposition", "It outputs a fraction like 0.5", "It duplicates itself"],
      correctIdx: 0,
      explanation: "Measurement forces the qubit's wavefunction to collapse, yielding a single classical outcome (either 0 or 1)."
    }
  ];

  return (
    <LessonLayout expId="EXP-03" title="Superposition">
      <LessonSection number="01" title="The Concept of Superposition">
        <ConceptPanel 
          leftContent={<>Classical computers store certainty. A bit is exactly <code>0</code> or exactly <code>1</code>. It never fluctuates.</>}
          leftCode="BIT = 0"
          rightContent={<>Quantum computers utilize <strong>Superposition</strong>. A qubit can exist in a state that is a weighted combination of <code>|0⟩</code> and <code>|1⟩</code>, mathematically represented as a probability amplitude.</>}
          rightCode="QUBIT = α|0⟩ + β|1⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="Visualizing Superposition">
        <p style={{ marginBottom: '2rem' }}>
          When we apply the Hadamard (H) gate to a qubit in the |0⟩ state, it creates an equal superposition known as the |+⟩ state.
        </p>
        <StateVisualizer stateName="|+⟩" />
      </LessonSection>

      <LessonSection number="03" title="Running a Superposition Circuit">
        <p style={{ marginBottom: '2rem' }}>
          Let's run this on the Qiskit simulator. We apply the H gate and measure. Watch how the deterministic state collapses into a probabilistic distribution.
        </p>
        <SimulationRunner 
          circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }], shots: 1000 }}
          onSimulationComplete={setSimResult}
        />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <div className="tech-label" style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>ANALYSIS</div>
            <p>
              The measurement yielded roughly a 50/50 split between 0 and 1. Though individual shots are random, thousands of shots reveal the true underlying probability distribution of the <code>|+⟩</code> state.
            </p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge: Create a Superposition">
        <p style={{ marginBottom: '2rem' }}>
          Your task: Dispatch a circuit using the H gate to achieve an approximately 50% / 50% measurement distribution.
        </p>
        <SimulationRunner 
          buttonText="DISPATCH CHALLENGE CIRCUIT"
          circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }], shots: 2000 }}
          onSimulationComplete={setChallengeResult}
        />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['0'] > 800 && challengeResult.measurement_counts['1'] > 800) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['0'] > 800 && challengeResult.measurement_counts['1'] > 800) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['0'] > 800 && challengeResult.measurement_counts['1'] > 800) ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {(challengeResult.measurement_counts['0'] > 800 && challengeResult.measurement_counts['1'] > 800) ? (
              <div className="text-mono text-green">SUCCESS: EQUAL SUPERPOSITION ACHIEVED.</div>
            ) : (
              <div className="text-mono text-red">FAILED: ASYMMETRIC DISTRIBUTION.</div>
            )}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? (
          <div>
            <div className="tech-label text-green" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>EXPERIMENT COMPLETE // LOGGED</div>
            <Link to="/learn/measurement"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link>
          </div>
        ) : (
          <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>
        )}
      </div>
    </LessonLayout>
  );
};
export default SuperpositionLesson;
