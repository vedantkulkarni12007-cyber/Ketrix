import { useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const MeasurementLesson = () => {
  const [simResult0, setSimResult0] = useState(null);
  const [simResultPlus, setSimResultPlus] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    {
      question: "What is the primary effect of measurement in quantum mechanics?",
      options: ["It creates superposition", "It forces the state to collapse to a classical definite value", "It reverses the circuit", "It copies the qubit"],
      correctIdx: 1,
      explanation: "Measurement collapses the quantum state into one of the classical basis states (0 or 1), permanently destroying the superposition."
    }
  ];

  return (
    <LessonLayout expId="EXP-04" title="Measurement">
      <LessonSection number="01" title="The Act of Observation">
        <ConceptPanel 
          leftContent={<>When a quantum state is <strong>unmeasured</strong>, it can hold a complex superposition of possibilities.</>}
          leftCode="UNOBSERVED: |+⟩ = (|0⟩ + |1⟩)/√2"
          rightContent={<>When <strong>measured</strong>, the quantum state forcefully collapses to a single classical reality.</>}
          rightCode="OBSERVED: 0 or 1"
        />
      </LessonSection>

      <LessonSection number="02" title="Measuring a Deterministic State">
        <p style={{ marginBottom: '2rem' }}>
          If a qubit is in the |0⟩ state and we measure it, there is 100% probability it will output 0.
        </p>
        <SimulationRunner circuitDef={{ num_qubits: 1, operations: [{ gate: 'M', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult0} />
        {simResult0 && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 100% of measurements yielded state 0.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="03" title="Measuring a Superposition">
        <p style={{ marginBottom: '2rem' }}>
          However, if we prepare the |+⟩ state (using H) and measure it, the outcome is probabilistic.
        </p>
        <SimulationRunner circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }, { gate: 'M', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResultPlus} />
        {simResultPlus && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: The measurement yielded {simResultPlus.measurement_counts['0'] || 0} zeros and {simResultPlus.measurement_counts['1'] || 0} ones, demonstrating collapse from superposition.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge: Observe the Collapse">
        <p style={{ marginBottom: '2rem' }}>Dispatch a circuit that prepares |+⟩ and then measures it.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }, { gate: 'M', target: 0 }], shots: 1024 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400) ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {(challengeResult.measurement_counts['0'] > 400 && challengeResult.measurement_counts['1'] > 400) ? <div className="text-mono text-green">SUCCESS: PROBABILISTIC MEASUREMENT CONFIRMED.</div> : <div className="text-mono text-red">FAILED</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? (
          <div><Link to="/learn/x-gate"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div>
        ) : (<button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>)}
      </div>
    </LessonLayout>
  );
};
export default MeasurementLesson;
