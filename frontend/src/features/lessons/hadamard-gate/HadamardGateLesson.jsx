import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const HadamardGateLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "What happens if you apply the Hadamard gate twice in a row?", options: ["The qubit remains in superposition", "The qubit returns to its original state", "The qubit is destroyed", "The probability of measuring 1 becomes 100%"], correctIdx: 1, explanation: "The H gate is its own inverse (H² = I). Applying it twice to |0⟩ takes it to |+⟩ and then back to |0⟩." }
  ];

  return (
    <LessonLayout expId="EXP-08" title="Hadamard Gate">
      <LessonSection number="01" title="The Gateway to Superposition">
        <ConceptPanel 
          leftContent={<>The Hadamard (H) gate transforms a definite state into an equal superposition.</>} leftCode="H|0⟩ = |+⟩"
          rightContent={<>It is its own inverse. Applying H to a superposition collapses it deterministically through quantum interference.</>} rightCode="H|+⟩ = |0⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="Visualizing Reversibility">
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|+⟩" /></div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>&rarr; H &rarr;</div>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|0⟩" /></div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Simulating Quantum Interference">
        <p style={{ marginBottom: '2rem' }}>Watch what happens when we apply H twice. Instead of being random, the quantum waves interfere constructively, returning perfectly to |0⟩ with 100% certainty.</p>
        <SimulationRunner circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }, { gate: 'H', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult} />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 100% of measurements yielded state 0. Constructive interference restored the original state.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Apply H, then Z, then H to the |0⟩ state. What happens? (Hint: The Z gate flipped the phase, creating interference that directs the state to |1⟩).</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 1, operations: [{ gate: 'H', target: 0 }, { gate: 'Z', target: 0 }, { gate: 'H', target: 0 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['1'] > 900) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {(challengeResult.measurement_counts['1'] > 900) ? <div className="text-mono text-green">SUCCESS: HZH SEQUENCE IS EQUIVALENT TO THE X GATE!</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>RETURN TO CURRICULUM &rarr;</button></Link></div> : <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default HadamardGateLesson;
