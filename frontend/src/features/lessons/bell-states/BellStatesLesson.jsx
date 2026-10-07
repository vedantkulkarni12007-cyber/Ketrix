import { useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const BellStatesLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "Why can't you distinguish |Φ+⟩ from |Φ-⟩ using only standard computational basis measurement?", options: ["Because they are the same state", "Because measurement ignores relative phase, and both give 50% 00 and 50% 11", "Because the simulator is broken", "Because they decay instantly"], correctIdx: 1, explanation: "Both |Φ+⟩ and |Φ-⟩ collapse to either 00 or 11. Their difference lies in a negative phase, which is only observable via interference (e.g., applying H gates before measuring)." }
  ];

  return (
    <LessonLayout expId="EXP-12" title="Bell States">
      <LessonSection number="01" title="Maximally Entangled States">
        <ConceptPanel 
          leftContent={<>The four <strong>Bell States</strong> form a complete orthogonal basis for a 2-qubit system. They are the simplest examples of maximal entanglement.</>} leftCode="|Φ+⟩ = (|00⟩ + |11⟩) / √2"
          rightContent={<>The other three states are variations involving bit flips or phase flips of the initial |Φ+⟩ state.</>} rightCode="|Φ-⟩, |Ψ+⟩, |Ψ-⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="The Limits of Measurement">
        <p style={{ marginBottom: '2rem' }}>
          If we create |Φ-⟩ = (|00⟩ - |11⟩)/√2 using H(q0), CX(q0,q1), and Z(q0), the measurement distribution is identical to |Φ+⟩. Phase is destroyed upon measurement in the standard basis.
        </p>
        <SimulationRunner circuitDef={{ num_qubits: 2, operations: [{ gate: 'H', target: 0 }, { gate: 'CX', control: 0, target: 1 }, { gate: 'Z', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult} />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 50% |00⟩ and 50% |11⟩. The negative phase is invisible to this measurement.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="03" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="04" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Create the |Ψ+⟩ = (|01⟩ + |10⟩)/√2 Bell state. Hint: H(q0), CX(q0,q1) makes |Φ+⟩ (00 and 11). Apply X to q1 afterwards to flip the bits to 01 and 10.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 2, operations: [{ gate: 'H', target: 0 }, { gate: 'CX', control: 0, target: 1 }, { gate: 'X', target: 1 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['10'] > 400) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['10'] > 400) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label">SYSTEM VALIDATION</div>
            {(challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['10'] > 400) ? <div className="text-mono text-green">SUCCESS: |Ψ+⟩ PREPARED.</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>RETURN TO MODULE SELECTION &rarr;</button></Link></div> : <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default BellStatesLesson;
