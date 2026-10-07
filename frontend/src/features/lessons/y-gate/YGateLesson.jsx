import { useState } from 'react';
import { Link } from 'react-router-dom';
import StateVisualizer from '../components/StateVisualizer';
import Quiz from '../components/Quiz';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';

const YGateLesson = () => {
  const [simResult, setSimResult] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const quizQuestions = [
    { question: "What is unique about the Y gate compared to the X gate?", options: ["It creates a 50/50 superposition", "It flips the qubit AND adds a complex phase (i)", "It does nothing to |0⟩", "It measures the qubit"], correctIdx: 1, explanation: "The Y gate flips the computational basis states just like the X gate, but it also multiplies the state by an imaginary phase factor." }
  ];

  return (
    <LessonLayout expId="EXP-06" title="Y Gate">
      <LessonSection number="01" title="The Pauli-Y Gate">
        <ConceptPanel 
          leftContent={<>The X gate simply flips |0⟩ to |1⟩.</>} leftCode="X|0⟩ = |1⟩"
          rightContent={<>The Y gate also flips the state, but introduces a <strong>complex phase</strong> (imaginary number <em>i</em>). This phase doesn't change the measurement probability of a single isolated qubit, but drastically affects interference when combined with other gates.</>} rightCode="Y|0⟩ = i|1⟩"
        />
      </LessonSection>

      <LessonSection number="02" title="Visualizing the Phase Effect">
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|0⟩" /></div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>&rarr; Y &rarr;</div>
          <div style={{ flex: 1 }}><StateVisualizer stateName="|i⟩" /></div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Simulating the Y Gate">
        <p style={{ marginBottom: '2rem' }}>When measured immediately, Y|0⟩ appears identical to X|0⟩ (100% chance of |1⟩), because measurement destroys the phase information.</p>
        <SimulationRunner circuitDef={{ num_qubits: 1, operations: [{ gate: 'Y', target: 0 }], shots: 1000 }} onSimulationComplete={setSimResult} />
        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <p className="text-mono">ANALYSIS: 100% of measurements yielded state 1. Phase is invisible to measurement.</p>
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Knowledge Check">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <LessonSection number="05" title="Challenge">
        <p style={{ marginBottom: '2rem' }}>Apply the Y gate to |0⟩ and observe that the measurement is purely |1⟩.</p>
        <SimulationRunner buttonText="DISPATCH CHALLENGE CIRCUIT" circuitDef={{ num_qubits: 1, operations: [{ gate: 'Y', target: 0 }], shots: 1000 }} onSimulationComplete={setChallengeResult} />
        {challengeResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: (challengeResult.measurement_counts['1'] > 900) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', border: `1px solid ${(challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            <div className="tech-label" style={{ color: (challengeResult.measurement_counts['1'] > 900) ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>SYSTEM VALIDATION RESULT</div>
            {(challengeResult.measurement_counts['1'] > 900) ? <div className="text-mono text-green">SUCCESS: STATE FLIPPED (PHASE HIDDEN BY MEASUREMENT).</div> : <div className="text-mono text-red">FAILED.</div>}
          </div>
        )}
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? <div><Link to="/learn/z-gate"><button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)' }}>INITIATE NEXT EXPERIMENT &rarr;</button></Link></div> : <button onClick={() => setLessonComplete(true)} style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>MARK EXPERIMENT COMPLETE</button>}
      </div>
    </LessonLayout>
  );
};
export default YGateLesson;
