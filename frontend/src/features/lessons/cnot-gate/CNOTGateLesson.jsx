import { useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const CNOTGateLesson = () => {
  const [simResult00, setSimResult00] = useState(null);
  const [simResult10, setSimResult10] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "What happens if the control qubit of a CNOT is in state |0⟩?", options: ["The target qubit is flipped", "The target qubit remains unchanged", "The control qubit is flipped", "Both qubits are measured"], correctIdx: 1, explanation: "If the control qubit is |0⟩, the CNOT gate does nothing to the target qubit." },
    { question: "If control is |1⟩ and target is |0⟩, what is the output state after CNOT?", options: ["|10⟩", "|01⟩", "|11⟩", "|00⟩"], correctIdx: 2, explanation: "The control |1⟩ causes the target |0⟩ to flip to |1⟩, resulting in the state |11⟩." }
  ];

  return (
    <LessonLayout expId="EXP-09" title="CNOT Gate">
      <LessonSection number="01" title="The Controlled-NOT Gate">
        <ConceptPanel 
          leftContent={<>The <strong>CNOT</strong> gate acts on two qubits: a control and a target. If the control is <code>|1⟩</code>, the target flips (X gate is applied).</>} leftCode="CX |10⟩ = |11⟩"
          rightContent={<>If the control is <code>|0⟩</code>, the target remains unchanged.</>} rightCode="CX |00⟩ = |00⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="Truth Table">
        <div style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)', padding: '2rem', marginBottom: '2rem' }}>
          <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ paddingBottom: '1rem' }}>Control (q1)</th>
                <th style={{ paddingBottom: '1rem' }}>Target (q0)</th>
                <th style={{ paddingBottom: '1rem' }}>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ paddingTop: '1rem' }}>|0⟩</td><td style={{ paddingTop: '1rem' }}>|0⟩</td><td style={{ paddingTop: '1rem' }}>|00⟩</td></tr>
              <tr><td>|0⟩</td><td>|1⟩</td><td>|01⟩</td></tr>
              <tr><td>|1⟩</td><td>|0⟩</td><td>|11⟩ (Target flipped)</td></tr>
              <tr><td>|1⟩</td><td>|1⟩</td><td>|10⟩ (Target flipped)</td></tr>
            </tbody>
          </table>
          <div className="text-mono text-dim" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>* NOTE: Qiskit orders bitstrings as q1 q0. q1 is control, q0 is target.</div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Simulating CNOT: Control is 0">
        <p style={{ marginBottom: '2rem' }}>We apply CNOT with control=q1, target=q0. Since q1 is |0⟩, q0 should remain |0⟩. The output should be |00⟩.</p>
        <SimulationRunner circuitDef={{ num_qubits: 2, operations: [{ gate: 'CX', control: 1, target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult00} />
        {simResult00 && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 100% |00⟩. The target remained 0.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Simulating CNOT: Control is 1">
        <p style={{ marginBottom: '2rem' }}>First, we apply an X gate to q1, making it |1⟩. Then we apply CNOT (control=q1, target=q0). This should flip q0 to |1⟩. The output should be |11⟩.</p>
        <SimulationRunner circuitDef={{ num_qubits: 2, operations: [{ gate: 'X', target: 1 }, { gate: 'CX', control: 1, target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult10} />
        {simResult10 && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 100% |11⟩. The target flipped to 1 because the control was 1.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="05" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="06" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Prepare the target qubit (q0) in |1⟩ using an X gate. Prepare the control (q1) in |1⟩ using an X gate. Apply CNOT(control=q1, target=q0). What should happen? The target |1⟩ will flip back to |0⟩, resulting in |10⟩!</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 2, operations: [{ gate: 'X', target: 0 }, { gate: 'X', target: 1 }, { gate: 'CX', control: 1, target: 0 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['10'] > 900) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['10'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['10'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)' }}>SYSTEM VALIDATION</div>
            {(challengeResult.measurement_counts['10'] > 900) ? <div className="text-mono text-green">SUCCESS: STATE MEASURED AS 10.</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn/multiple-qubits"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div> : <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default CNOTGateLesson;
