import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';
import Quiz from '../components/Quiz';

const DeutschJozsaLesson = () => {
  const [oracleType, setOracleType] = useState('constant_0');
  const [simResult, setSimResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const getOracleOperations = (type) => {
    switch (type) {
      case 'constant_0':
        return [];
      case 'constant_1':
        return [{ gate: 'X', target: 2 }];
      case 'balanced_1':
        return [
          { gate: 'CX', control: 0, target: 2 },
          { gate: 'CX', control: 1, target: 2 }
        ];
      case 'balanced_2':
        return [
          { gate: 'X', target: 0 },
          { gate: 'CX', control: 0, target: 2 },
          { gate: 'X', target: 0 },
          { gate: 'CX', control: 1, target: 2 }
        ];
      default:
        return [];
    }
  };

  const circuitDef = useMemo(() => {
    const ops = [
      // 1. Ancilla init (q2 to |1>)
      { gate: 'X', target: 2 },
      
      // 2. Superposition (H on all 3)
      { gate: 'H', target: 0 },
      { gate: 'H', target: 1 },
      { gate: 'H', target: 2 },
    ];
    
    // 3. Oracle
    ops.push(...getOracleOperations(oracleType));
    
    // 4. Interference (H on inputs)
    ops.push(
      { gate: 'H', target: 0 },
      { gate: 'H', target: 1 }
    );
    
    // 5. Measure inputs
    ops.push(
      { gate: 'M', target: 0 },
      { gate: 'M', target: 1 }
    );

    return {
      num_qubits: 3,
      operations: ops,
      shots: 1024
    };
  }, [oracleType]);

  const quizQuestions = [
    {
      question: "What is the primary advantage of the Deutsch-Jozsa algorithm over classical algorithms?",
      options: [
        "It solves the problem with a single oracle query, whereas classical algorithms require exponentially many.",
        "It uses fewer bits to store the result.",
        "It guarantees that the oracle will never return an error."
      ],
      correctIdx: 0,
      explanation: "Deutsch-Jozsa requires exactly 1 query to the oracle to determine if it is constant or balanced, while a classical computer requires 2^(n-1) + 1 queries in the worst case."
    },
    {
      question: "In the algorithm, why do we apply H gates before the oracle?",
      options: [
        "To initialize the ancilla to |1⟩.",
        "To place all input qubits into a superposition of all possible states.",
        "To measure the final state immediately."
      ],
      correctIdx: 1,
      explanation: "H gates on the input qubits create an equal superposition, allowing the oracle to evaluate all possible inputs simultaneously."
    },
    {
      question: "What does it mean if you measure the state |00...0⟩ at the end?",
      options: [
        "The function is balanced.",
        "The function is constant.",
        "The circuit failed."
      ],
      correctIdx: 1,
      explanation: "If the final state is exclusively |0...0⟩, quantum interference has completely cancelled all other states, proving the function is constant."
    }
  ];

  return (
    <LessonLayout expId="EXP-13" title="Deutsch-Jozsa Algorithm">
      
      {/* SECTION 01: LEARN */}
      <LessonSection number="01" title="The Oracle Problem">
        <p style={{ marginBottom: '2rem' }}>
          Welcome to one of the first demonstrations of exponential quantum advantage.
          Imagine you are given a mysterious black box function (an <strong>Oracle</strong>) that takes an $n$-bit input and returns a $1$-bit output (0 or 1).
        </p>

        <ConceptPanel 
          leftTitle="CONSTANT FUNCTION"
          leftContent="Returns the exact same output (e.g., always 0 or always 1) no matter what input you provide."
          leftCode="f(x) = 0  ∀x"
          rightTitle="BALANCED FUNCTION"
          rightContent="Returns 0 for exactly half of the inputs, and 1 for the other half."
          rightCode="Count(0) == Count(1)"
        />

        <p style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <strong>The Promise:</strong> We are guaranteed the function is either strictly <i>constant</i> or strictly <i>balanced</i>.
          Our goal is to determine which one it is, using the fewest possible queries to the Oracle.
        </p>

        <div style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>CLASSICAL LIMITATION</h3>
          <p>
            Classically, if you have $n$ input bits, there are $2^n$ possible inputs. 
            To be 100% certain, you might have to check just over half of the inputs. That requires 2^(n-1) + 1 queries.
            For $n=20$, that is over 500,000 queries!
          </p>
        </div>
      </LessonSection>

      {/* SECTION 02: THE QUANTUM SOLUTION */}
      <LessonSection number="02" title="The Quantum Solution">
        <p style={{ marginBottom: '2rem' }}>
          The Deutsch-Jozsa algorithm requires exactly <strong>ONE</strong> quantum query, regardless of how large $n$ is. 
          It orchestrates quantum interference so that the incorrect answers cancel themselves out.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>1.</div>
            <div>Initialize $n$ input qubits to $|0\rangle$, and 1 ancilla (workspace) qubit to $|1\rangle$.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>2.</div>
            <div>Apply Hadamard ($H$) gates to all qubits, putting them into superposition.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>3.</div>
            <div>Query the Oracle $U_f$. This flips the phase of states where $f(x) = 1$.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>4.</div>
            <div>Apply $H$ gates again to the input qubits to interfere the amplitudes.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>5.</div>
            <div>Measure the $n$ input qubits.</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', borderLeft: '4px solid var(--accent-blue)', backgroundColor: 'var(--bg-panel)' }}>
          <strong>The Result:</strong> If the measurement is all zeros (e.g., <code>00</code>), the function is <strong>Constant</strong>. If it is anything else, the function is <strong>Balanced</strong>.
        </div>
      </LessonSection>

      {/* SECTION 03: INTERACTIVE EXPERIMENT */}
      <LessonSection number="03" title="Experiment">
        <p style={{ marginBottom: '2rem' }}>
          Select an Oracle to embed in our circuit. Our circuit uses 2 input qubits (q0, q1) and 1 ancilla (q2).
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={() => { setOracleType('constant_0'); setSimResult(null); }}
            style={{
              backgroundColor: oracleType === 'constant_0' ? 'var(--bg-panel-light)' : 'transparent',
              borderColor: oracleType === 'constant_0' ? 'var(--accent-blue)' : 'var(--border-light)',
              color: oracleType === 'constant_0' ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
          >
            CONSTANT f(x) = 0
          </button>
          <button
            onClick={() => { setOracleType('constant_1'); setSimResult(null); }}
            style={{
              backgroundColor: oracleType === 'constant_1' ? 'var(--bg-panel-light)' : 'transparent',
              borderColor: oracleType === 'constant_1' ? 'var(--accent-blue)' : 'var(--border-light)',
              color: oracleType === 'constant_1' ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
          >
            CONSTANT f(x) = 1
          </button>
          <button
            onClick={() => { setOracleType('balanced_1'); setSimResult(null); }}
            style={{
              backgroundColor: oracleType === 'balanced_1' ? 'var(--bg-panel-light)' : 'transparent',
              borderColor: oracleType === 'balanced_1' ? 'var(--accent-blue)' : 'var(--border-light)',
              color: oracleType === 'balanced_1' ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
          >
            BALANCED f(x) = x_0 ⊕ x_1
          </button>
          <button
            onClick={() => { setOracleType('balanced_2'); setSimResult(null); }}
            style={{
              backgroundColor: oracleType === 'balanced_2' ? 'var(--bg-panel-light)' : 'transparent',
              borderColor: oracleType === 'balanced_2' ? 'var(--accent-blue)' : 'var(--border-light)',
              color: oracleType === 'balanced_2' ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
          >
            BALANCED f(x) = ¬x_0 ⊕ x_1
          </button>
        </div>

        <div className="sci-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h4 className="tech-label" style={{ marginBottom: '1rem' }}>DYNAMIC CIRCUIT MANIFEST</h4>
          <pre className="text-mono text-dim" style={{ fontSize: '0.85rem', overflowX: 'auto' }}>
            {JSON.stringify(circuitDef.operations, null, 2)}
          </pre>
        </div>
        
        <SimulationRunner 
          buttonText="DISPATCH DJ ALGORITHM"
          circuitDef={circuitDef}
          onSimulationComplete={setSimResult}
        />

        {simResult && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <div className="tech-label" style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>OBSERVATION LOG</div>
            
            {/* The string looks like "000" or "011". We focus on the inputs, which are the rightmost characters if c2 is 0. Wait, qiskit puts c0 on the far right. So "c2 c1 c0". c2 is always 0. The output is c2c1c0. */}
            <p>
              The simulation returned states mapped as <code>(ancilla)(q1)(q0)</code>. Since we only measured q0 and q1, the ancilla bit is always <code>0</code>.
            </p>
            
            {Object.entries(simResult.measurement_counts).map(([state, count]) => {
              if (count === 0) return null;
              // Qiskit string: c2 c1 c0. So slice(-2) gets c1 c0.
              const inputState = state.slice(-2);
              const isConstant = inputState === '00';
              
              return (
                <div key={state} style={{ 
                  marginTop: '1rem', 
                  padding: '1.5rem', 
                  backgroundColor: isConstant ? 'rgba(52, 211, 153, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                  border: `1px solid ${isConstant ? 'var(--accent-green)' : '#8b5cf6'}`
                }}>
                  <div className="text-mono" style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: isConstant ? 'var(--accent-green)' : '#8b5cf6' }}>
                    MEASURED: {inputState}
                  </div>
                  <p style={{ margin: 0 }}>
                    {isConstant 
                      ? "The input qubits collapsed to 00. This proves unequivocally that the Oracle is CONSTANT."
                      : "The input qubits collapsed to a non-zero state. This proves unequivocally that the Oracle is BALANCED."}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </LessonSection>

      {/* SECTION 04: TEST */}
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

export default DeutschJozsaLesson;
