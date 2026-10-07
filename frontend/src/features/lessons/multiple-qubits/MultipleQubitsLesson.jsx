import { useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const MultipleQubitsLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "How many computational basis states does a 3-qubit system have?", options: ["3", "6", "8", "9"], correctIdx: 2, explanation: "An n-qubit system has 2^n basis states. 2^3 = 8 states: 000, 001, 010, 011, 100, 101, 110, 111." }
  ];

  return (
    <LessonLayout expId="EXP-10" title="Multiple Qubits">
      <LessonSection number="01" title="Scaling Up">
        <ConceptPanel 
          leftContent={<>A 1-qubit system has 2 states (0, 1). A 2-qubit system has 4 states (00, 01, 10, 11).</>} leftCode="2^2 = 4 STATES"
          rightContent={<>Every time you add a qubit, the number of basis states doubles. A general n-qubit system has 2^n basis states.</>} rightCode="2^n STATES"
        />
      </LessonSection>

      <LessonSection number="02" title="Qiskit Ordering Convention">
        <p style={{ marginBottom: '2rem' }}>
          When observing multi-qubit measurements, you must know how they are ordered. Qiskit uses <strong>little-endian</strong> ordering. The qubit at index 0 (q0) is written as the <em>right-most</em> bit.
        </p>
        <div style={{ padding: '1rem', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-panel-light)', fontFamily: 'var(--font-mono)' }}>
          <p>q2 q1 q0</p>
          <p>If q0=|1⟩, q1=|0⟩, q2=|0⟩  → State is |001⟩</p>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Independent Superpositions">
        <p style={{ marginBottom: '2rem' }}>Let's apply a Hadamard gate to just one qubit (q1) in a 2-qubit system. We expect q1 to be 50% |0⟩ and 50% |1⟩, while q0 remains exactly |0⟩. The outcomes will be 00 and 10.</p>
        <SimulationRunner circuitDef={{ num_qubits: 2, operations: [{ gate: 'H', target: 1 }], shots: 1000 }} onSimulationComplete={setSimResult} />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: ~50% |00⟩ and ~50% |10⟩. The right-most bit (q0) is strictly 0.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Apply an X gate to q0, and an H gate to q1. You should observe states 01 and 11 evenly split.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 2, operations: [{ gate: 'X', target: 0 }, { gate: 'H', target: 1 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['11'] > 400) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['11'] > 400) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label">SYSTEM VALIDATION</div>
            {(challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['11'] > 400) ? <div className="text-mono text-green">SUCCESS.</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn/entanglement"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div> : <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default MultipleQubitsLesson;
