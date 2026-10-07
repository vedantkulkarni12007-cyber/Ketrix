import { useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const EntanglementLesson = () => {
  const [simResultInd, setSimResultInd] = useState(null);
  const [simResultEnt, setSimResultEnt] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "What does it mean for two qubits to be entangled?", options: ["They communicate faster than light", "Their quantum states cannot be described independently of each other", "They are physically touching", "They are both in state |0⟩"], correctIdx: 1, explanation: "Entanglement means their joint state is inextricably linked; measuring one instantly constraints the possible measurement of the other, without FTL classical communication." }
  ];

  return (
    <LessonLayout expId="EXP-11" title="Quantum Entanglement">
      <LessonSection number="01" title="Spooky Action">
        <ConceptPanel 
          leftContent={<><strong>Independent</strong> qubits can be measured without affecting each other. E.g., if both are in superposition, you get all 4 combinations (00, 01, 10, 11).</>} leftCode="H(q0), H(q1)"
          rightContent={<><strong>Entangled</strong> qubits are mathematically linked. Measuring one instantaneously determines or constrains the other, regardless of distance.</>} rightCode="H(q0) → CX(q0, q1)"
        />
      </LessonSection>

      <LessonSection number="02" title="Independent Superposition (Control)">
        <p style={{ marginBottom: '2rem' }}>First, we apply an H gate to both qubits independently. Observe that all 4 states appear with ~25% probability.</p>
        <SimulationRunner circuitDef={{ num_qubits: 2, operations: [{ gate: 'H', target: 0 }, { gate: 'H', target: 1 }], shots: 1000 }} onSimulationComplete={setSimResultInd} />
        {simResultInd && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: ~25% for 00, 01, 10, 11. The qubits are completely independent.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="03" title="Creating Entanglement">
        <p style={{ marginBottom: '2rem' }}>Now we create entanglement: H on q0, then CNOT(control=q0, target=q1). Notice that 01 and 10 NEVER occur. If q0 is 0, q1 is 0. If q0 is 1, q1 is 1.</p>
        <SimulationRunner circuitDef={{ num_qubits: 2, operations: [{ gate: 'H', target: 0 }, { gate: 'CX', control: 0, target: 1 }], shots: 1000 }} onSimulationComplete={setSimResultEnt} />
        {simResultEnt && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: ~50% |00⟩ and ~50% |11⟩. States 01 and 10 are completely missing. The qubits are perfectly correlated!</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Create an entangled state where the qubits are always OPPOSITE (i.e. 01 or 10). Hint: Start by flipping q1 to |1⟩ using X, then apply the H → CX sequence.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 2, operations: [{ gate: 'X', target: 1 }, { gate: 'H', target: 0 }, { gate: 'CX', control: 0, target: 1 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['10'] > 400) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['10'] > 400) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label">SYSTEM VALIDATION</div>
            {(challengeResult.measurement_counts['01'] > 400 && challengeResult.measurement_counts['10'] > 400) ? <div className="text-mono text-green">SUCCESS: ANTI-CORRELATED ENTANGLEMENT VERIFIED.</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn/bell-states"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div> : <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default EntanglementLesson;
