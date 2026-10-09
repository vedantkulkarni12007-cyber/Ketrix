import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const XGateLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "What does the X gate do?", options: ["It creates a superposition", "It flips the qubit from |0⟩ to |1⟩ and vice versa", "It measures the qubit", "It changes the phase"], correctIdx: 1, explanation: "The X gate is the quantum equivalent of the classical NOT gate, swapping the probabilities of |0⟩ and |1⟩." }
  ];

  return (
    <LessonLayout expId="EXP-05" title="X Gate">
      <LessonSection number="01" title="The Quantum NOT Gate">
        <ConceptPanel 
          leftContent={<>A classical NOT gate flips a bit from 0 to 1, or 1 to 0.</>} leftCode="NOT(0) = 1"
          rightContent={<>The Pauli-X gate does the same for a quantum state, flipping the amplitudes of |0⟩ and |1⟩.</>} rightCode="X|0⟩ = |1⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="Visualizing the X Gate">
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|0⟩" /></div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>&rarr; X &rarr;</div>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|1⟩" /></div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Simulating the X Gate">
        <p style={{ marginBottom: '2rem' }}>Let's run a circuit that applies the X gate to |0⟩, expecting 100% measurement of state 1.</p>
        <SimulationRunner circuitDef={{ num_qubits: 1, operations: [{ gate: 'X', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult} />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 100% of measurements yielded state 1.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Apply the X gate to flip the qubit from |0⟩ to |1⟩.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 1, operations: [{ gate: 'X', target: 0 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['1'] > 900) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {(challengeResult.measurement_counts['1'] > 900) ? <div className="text-mono text-green">SUCCESS: BIT FLIP ACHIEVED.</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn/y-gate"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div> : <button onClick={() => { setLessonComplete(true); try { const id = window.location.pathname.split('/').pop(); const saved = JSON.parse(localStorage.getItem('ketrix_completed_lessons') || '[]'); if(!saved.includes(id)) { saved.push(id); localStorage.setItem('ketrix_completed_lessons', JSON.stringify(saved)); } } catch(e){} }} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default XGateLesson;
