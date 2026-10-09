import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const ZGateLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "What does the Z gate do?", options: ["It flips |0⟩ to |1⟩", "It applies a negative phase to |1⟩, leaving |0⟩ unchanged", "It measures the qubit", "It makes a superposition"], correctIdx: 1, explanation: "The Z gate is a phase-flip gate. It maps |0⟩ to |0⟩, and |1⟩ to -|1⟩." }
  ];

  return (
    <LessonLayout expId="EXP-07" title="Z Gate">
      <LessonSection number="01" title="The Phase Flip Gate">
        <ConceptPanel 
          leftContent={<>The X gate changes probability. The Z gate changes <strong>phase</strong>.</>} leftCode="Z|0⟩ = |0⟩"
          rightContent={<>If a qubit is in the |1⟩ state, applying Z gives it a negative phase, which is crucial for quantum interference.</>} rightCode="Z|1⟩ = -|1⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="Visualizing Phase Change">
        <p style={{ marginBottom: '2rem' }}>When applied to a superposition |+⟩, the Z gate flips it to |-⟩. The probability of measuring 0 or 1 remains 50/50, but the relative phase is inverted!</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|+⟩" /></div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>&rarr; Z &rarr;</div>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|-⟩" /></div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Simulating the Phase Flip">
        <p style={{ marginBottom: '2rem' }}>Let's apply H, then Z, then measure. You'll see that measuring |-⟩ looks identical to measuring |+⟩ (50/50 distribution) because measurement ignores phase.</p>
        <SimulationRunner circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }, { gate: 'Z', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult} />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 50/50 distribution observed. The negative phase on |1⟩ does not alter its probability of being measured.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Dispatch a circuit that prepares |1⟩ (using X) and then applies Z.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 1, operations: [{ gate: 'X', target: 0 }, { gate: 'Z', target: 0 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['1'] > 900) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {(challengeResult.measurement_counts['1'] > 900) ? <div className="text-mono text-green">SUCCESS: STATE MEASURED AS |1⟩ (PHASE NOT OBSERVABLE).</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn/hadamard-gate"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div> : <button onClick={() => { setLessonComplete(true); try { const id = window.location.pathname.split('/').pop(); const saved = JSON.parse(localStorage.getItem('ketrix_completed_lessons') || '[]'); if(!saved.includes(id)) { saved.push(id); localStorage.setItem('ketrix_completed_lessons', JSON.stringify(saved)); } } catch(e){} }} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default ZGateLesson;
