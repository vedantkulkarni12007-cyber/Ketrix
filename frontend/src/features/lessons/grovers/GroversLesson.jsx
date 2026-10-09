import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';
import Quiz from '../components/Quiz';

const GroversLesson = () => {
  const [markedItem, setMarkedItem] = useState('10');
  const [iterations, setIterations] = useState(1);
  const [simResult, setSimResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const getOracleOps = (item) => {
    // Qiskit string order: q1 q0
    // So '10' means q1=1, q0=0
    const ops = [];
    if (item[0] === '0') ops.push({ gate: 'X', target: 1 });
    if (item[1] === '0') ops.push({ gate: 'X', target: 0 });
    
    // CZ
    ops.push(
      { gate: 'H', target: 1 },
      { gate: 'CX', control: 0, target: 1 },
      { gate: 'H', target: 1 }
    );
    
    if (item[1] === '0') ops.push({ gate: 'X', target: 0 });
    if (item[0] === '0') ops.push({ gate: 'X', target: 1 });
    
    return ops;
  };

  const getDiffuserOps = () => {
    return [
      { gate: 'H', target: 0 },
      { gate: 'H', target: 1 },
      { gate: 'X', target: 0 },
      { gate: 'X', target: 1 },
      { gate: 'H', target: 1 },
      { gate: 'CX', control: 0, target: 1 },
      { gate: 'H', target: 1 },
      { gate: 'X', target: 0 },
      { gate: 'X', target: 1 },
      { gate: 'H', target: 0 },
      { gate: 'H', target: 1 }
    ];
  };

  const circuitDef = useMemo(() => {
    const ops = [
      { gate: 'H', target: 0 },
      { gate: 'H', target: 1 }
    ];

    for (let i = 0; i < iterations; i++) {
      ops.push(...getOracleOps(markedItem));
      ops.push(...getDiffuserOps());
    }

    ops.push(
      { gate: 'M', target: 0 },
      { gate: 'M', target: 1 }
    );

    return {
      num_qubits: 2,
      operations: ops,
      shots: 1024
    };
  }, [markedItem, iterations]);

  const quizQuestions = [
    {
      question: "Why does applying too many Grover iterations reduce the probability of finding the marked item?",
      options: [
        "The system loses quantum coherence over time.",
        "The state vector overshoots the target state and rotates away from it.",
        "The oracle runs out of energy."
      ],
      correctIdx: 1,
      explanation: "Grover iterations rotate the state vector towards the marked state by a fixed angle. If you iterate too many times, the vector rotates past the marked state, reducing the measurement probability."
    },
    {
      question: "What is the purpose of the Diffusion Operator in Grover's Algorithm?",
      options: [
        "To initialize the qubits to an equal superposition.",
        "To invert the phase of the marked item.",
        "To perform an inversion about the mean, amplifying the probability of the marked state."
      ],
      correctIdx: 2,
      explanation: "The oracle flips the phase of the marked state (making its amplitude negative). The diffusion operator then mirrors all amplitudes across their average, heavily amplifying the negative one."
    },
    {
      question: "For a search space of size N, roughly how many iterations does Grover's Algorithm need?",
      options: [
        "N / 2",
        "sqrt(N)",
        "N^2"
      ],
      correctIdx: 1,
      explanation: "Grover's algorithm provides a quadratic speedup, meaning it requires roughly sqrt(N) iterations compared to the classical N/2 expected queries."
    }
  ];

  return (
    <LessonLayout expId="EXP-14" title="Grover's Search Algorithm">
      <LessonSection number="01" title="The Unstructured Search Problem">
        <p style={{ marginBottom: '2rem' }}>
          Imagine searching for a specific item in a completely unsorted database. A classical computer has no choice but to check items one by one. On average, it must check half the database ($N/2$).
        </p>
        
        <ConceptPanel 
          leftTitle="CLASSICAL SEARCH"
          leftContent="Checks each element sequentially. Time scales linearly with the number of elements."
          leftCode="O(N) Complexity"
          rightTitle="QUANTUM SEARCH"
          rightContent="Uses quantum superposition and interference to amplify the correct answer. Time scales with the square root of the number of elements."
          rightCode="O(√N) Complexity"
        />
      </LessonSection>

      <LessonSection number="02" title="Amplitude Amplification">
        <p style={{ marginBottom: '1rem' }}>
          Grover's algorithm consists of repeated applications of two mathematical operations:
        </p>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-panel)', borderLeft: '4px solid var(--accent-blue)' }}>
            <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>1. The Oracle (Phase Inversion)</h4>
            <p style={{ margin: 0 }}>
              The Oracle is a black-box that identifies the marked item. However, it doesn't extract it. Instead, it multiplies the amplitude of the marked item by -1, flipping it upside down.
            </p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-panel)', borderLeft: '4px solid var(--accent-amber)' }}>
            <h4 style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>2. The Diffuser (Inversion About Mean)</h4>
            <p style={{ margin: 0 }}>
              This operator calculates the average of all amplitudes and reflects them across this average. Because the marked item's amplitude was negative, this reflection dramatically increases its positive magnitude while shrinking everything else.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Experiment">
        <p style={{ marginBottom: '2rem' }}>
          We will search a 2-qubit database ($N=4$ items). For $N=4$, exactly <strong>1 iteration</strong> is optimal, rotating the probability to 100%. 
          Select a marked item and choose how many iterations to apply.
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div>
            <div className="tech-label" style={{ marginBottom: '0.5rem' }}>MARKED ITEM</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['00', '01', '10', '11'].map(item => (
                <button
                  key={item}
                  onClick={() => { setMarkedItem(item); setSimResult(null); }}
                  style={{
                    backgroundColor: markedItem === item ? 'var(--bg-panel-light)' : 'transparent',
                    borderColor: markedItem === item ? 'var(--accent-blue)' : 'var(--border-light)',
                    color: markedItem === item ? 'var(--accent-blue)' : 'var(--text-secondary)'
                  }}
                >
                  |{item}⟩
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="tech-label" style={{ marginBottom: '0.5rem' }}>ITERATIONS</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[0, 1, 2].map(iter => (
                <button
                  key={iter}
                  onClick={() => { setIterations(iter); setSimResult(null); }}
                  style={{
                    backgroundColor: iterations === iter ? 'var(--bg-panel-light)' : 'transparent',
                    borderColor: iterations === iter ? 'var(--accent-amber)' : 'var(--border-light)',
                    color: iterations === iter ? 'var(--accent-amber)' : 'var(--text-secondary)'
                  }}
                >
                  {iter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SimulationRunner 
          buttonText={`DISPATCH GROVER (${iterations} ITERATIONS)`}
          circuitDef={circuitDef}
          onSimulationComplete={setSimResult}
        />

        {simResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-light)' }}>
            <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>ANALYSIS</div>
            <p>
              Target state: <strong>|{markedItem}⟩</strong> <br />
              Actual measurement probability for |{markedItem}⟩: <strong>{((simResult.measurement_counts[markedItem] || 0) / 10.24).toFixed(1)}%</strong>
            </p>
            {iterations === 0 && (
              <p className="text-dim">With 0 iterations, the system remains in equal superposition (~25% each). No search has occurred.</p>
            )}
            {iterations === 1 && (
              <p className="text-green">With 1 iteration, the state vector perfectly aligns with the target state. Amplitude amplification is successful!</p>
            )}
            {iterations === 2 && (
              <p className="text-amber">With 2 iterations, the state vector has overshot the target! The probability drops back down. This demonstrates that Grover's algorithm requires precise calibration of iterations.</p>
            )}
          </div>
        )}
      </LessonSection>

      <LessonSection number="04" title="Test">
        <Quiz questions={quizQuestions} />
      </LessonSection>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
        {lessonComplete ? (
          <div>
            <div className="tech-label text-green" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              MODULE COMPLETE // LOGGED
            </div>
            <Link to="/learn">
              <button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)', borderColor: 'var(--accent-blue)' }}>
                RETURN TO DATABANKS &rarr;
              </button>
            </Link>
          </div>
        ) : (
          <button 
            onClick={() => { setLessonComplete(true); try { const id = window.location.pathname.split('/').pop(); const saved = JSON.parse(localStorage.getItem('ketrix_completed_lessons') || '[]'); if(!saved.includes(id)) { saved.push(id); localStorage.setItem('ketrix_completed_lessons', JSON.stringify(saved)); } } catch(e){} }}
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
          >
            MARK MODULE COMPLETE
          </button>
        )}
      </div>
    </LessonLayout>
  );
};

export default GroversLesson;
