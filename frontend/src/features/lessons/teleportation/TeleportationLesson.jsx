import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SimulationRunner from '../components/SimulationRunner';
import LessonLayout from '../components/LessonLayout';
import LessonSection from '../components/LessonSection';
import ConceptPanel from '../components/ConceptPanel';
import Quiz from '../components/Quiz';

const TeleportationLesson = () => {
  const [payloadState, setPayloadState] = useState('|1⟩');
  const [simResult, setSimResult] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const getPrepOps = (state, target) => {
    switch (state) {
      case '|1⟩': return [{ gate: 'X', target }];
      case '|+⟩': return [{ gate: 'H', target }];
      case '|-⟩': return [{ gate: 'X', target }, { gate: 'H', target }];
      case '|0⟩': default: return [];
    }
  };

  const getInversePrepOps = (state, target) => {
    // Applying the same sequence in reverse for these specific unitary gates (X and H are their own inverses)
    switch (state) {
      case '|1⟩': return [{ gate: 'X', target }];
      case '|+⟩': return [{ gate: 'H', target }];
      case '|-⟩': return [{ gate: 'H', target }, { gate: 'X', target }];
      case '|0⟩': default: return [];
    }
  };

  const circuitDef = useMemo(() => {
    const ops = [
      // 1. Prepare Payload on q0
      ...getPrepOps(payloadState, 0),

      // 2. Prepare Bell Pair on q1 (Alice) and q2 (Bob)
      { gate: 'H', target: 1 },
      { gate: 'CX', control: 1, target: 2 },

      // 3. Alice interacts her payload (q0) with her Bell half (q1)
      { gate: 'CX', control: 0, target: 1 },
      { gate: 'H', target: 0 },

      // 4. Alice measures her qubits
      { gate: 'M', target: 0 }, // c0
      { gate: 'M', target: 1 }, // c1

      // 5. Bob's conditional corrections based on classical communication
      { gate: 'X', target: 2, condition_bit: 1, condition_val: 1 },
      { gate: 'Z', target: 2, condition_bit: 0, condition_val: 1 },

      // 6. Verification: apply inverse of preparation to Bob's qubit and measure
      ...getInversePrepOps(payloadState, 2),
      { gate: 'M', target: 2 } // c2
    ];

    return {
      num_qubits: 3,
      operations: ops,
      shots: 1024
    };
  }, [payloadState]);

  const quizQuestions = [
    {
      question: "Does Quantum Teleportation transmit matter or permit faster-than-light communication?",
      options: [
        "Yes, it transmits the physical particle instantly.",
        "Yes, it sends information faster than light.",
        "No, it only transmits quantum information, and requires classical communication (which is limited by the speed of light) to complete the protocol."
      ],
      correctIdx: 2,
      explanation: "Teleportation only moves the quantum state (information), not the physical qubit itself. Furthermore, Bob cannot decode the state without Alice's classical measurement results, which must travel at or below the speed of light."
    },
    {
      question: "What happens to Alice's original qubit after she performs her measurements?",
      options: [
        "It remains in its original state.",
        "It collapses into a classical state, destroying the original quantum information.",
        "It becomes entangled with Bob's qubit again."
      ],
      correctIdx: 1,
      explanation: "Due to the No-Cloning Theorem, quantum information cannot be copied. Teleportation necessarily destroys the original state on Alice's side (by measuring it) in order to recreate it on Bob's side."
    },
    {
      question: "Why do we apply the inverse of the preparation circuit to Bob's qubit in our experiment?",
      options: [
        "To securely erase the data.",
        "To entangle it with another qubit.",
        "To mathematically verify the teleportation. If the teleportation was successful, the inverse operations will reliably return Bob's qubit to |0⟩."
      ],
      correctIdx: 2,
      explanation: "Since quantum states cannot be directly fully observed in a single shot without collapsing them, we verify the fidelity of the teleported state by un-computing it. A 100% measurement of |0⟩ proves the state was exactly what we intended."
    }
  ];

  return (
    <LessonLayout expId="EXP-15" title="Quantum Teleportation">
      <LessonSection number="01" title="The No-Cloning Theorem">
        <p style={{ marginBottom: '2rem' }}>
          In classical computing, copying data is trivial. In quantum computing, the <strong>No-Cloning Theorem</strong> dictates that it is impossible to create an identical copy of an arbitrary unknown quantum state.
          If we want to move quantum information from Alice to Bob, we cannot just "copy and paste" it.
        </p>

        <ConceptPanel 
          leftTitle="THE CHALLENGE"
          leftContent="Alice has a qubit in an unknown state |ψ⟩. She wants to send this exact state to Bob, but she cannot physically send the qubit itself."
          leftCode="|ψ⟩ = α|0⟩ + β|1⟩"
          rightTitle="THE SOLUTION"
          rightContent="Using an entangled Bell pair shared between Alice and Bob, Alice can destroy her state and recreate it on Bob's qubit via classical communication."
          rightCode="Teleportation Protocol"
        />
      </LessonSection>

      <LessonSection number="02" title="The Teleportation Protocol">
        <p style={{ marginBottom: '1rem' }}>
          The protocol requires three qubits. Qubit 0 is Alice's payload. Qubit 1 and 2 are an entangled pair shared between Alice and Bob.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>1.</div>
            <div><strong>Entanglement:</strong> Alice and Bob share a Bell pair (q1 and q2).</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>2.</div>
            <div><strong>Interaction:</strong> Alice applies a CNOT from her payload (q0) to her Bell half (q1), then a Hadamard to q0.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>3.</div>
            <div><strong>Measurement:</strong> Alice measures her two qubits. This collapses her state entirely.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>4.</div>
            <div><strong>Classical Communication:</strong> Alice sends her two classical bits to Bob (e.g., via phone or radio).</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="text-mono text-blue" style={{ width: '40px' }}>5.</div>
            <div><strong>Correction:</strong> Depending on Alice's bits, Bob applies an X and/or Z gate to his qubit (q2). Bob's qubit is now precisely the original payload state |ψ⟩!</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection number="03" title="Experiment & Verification">
        <p style={{ marginBottom: '2rem' }}>
          Select a payload state for Alice. Our simulation backend supports <strong>conditional classical feed-forward</strong>, allowing Bob's correction gates to fire dynamically based on Alice's measurements.
          <br/><br/>
          <strong>Verification Strategy:</strong> After Bob applies his corrections, we apply the <i>mathematical inverse</i> of Alice's state preparation to Bob's qubit. If the teleportation was perfect, Bob's qubit will uncompute exactly back to <code>|0⟩</code>, yielding a 0 on <code>c2</code> 100% of the time.
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div>
            <div className="tech-label" style={{ marginBottom: '0.5rem' }}>ALICE'S PAYLOAD STATE</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['|0⟩', '|1⟩', '|+⟩', '|-⟩'].map(state => (
                <button
                  key={state}
                  onClick={() => { setPayloadState(state); setSimResult(null); }}
                  style={{
                    backgroundColor: payloadState === state ? 'var(--bg-panel-light)' : 'transparent',
                    borderColor: payloadState === state ? 'var(--accent-blue)' : 'var(--border-light)',
                    color: payloadState === state ? 'var(--accent-blue)' : 'var(--text-secondary)'
                  }}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SimulationRunner 
          buttonText="DISPATCH TELEPORTATION PROTOCOL"
          circuitDef={circuitDef}
          onSimulationComplete={setSimResult}
        />

        {simResult && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-light)' }}>
            <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>FIDELITY ANALYSIS</div>
            <p>
              Recall that Qiskit outputs strings as <code>c2 c1 c0</code>. <br/>
              <code>c2</code> is Bob's verification measurement. <code>c1</code> and <code>c0</code> are Alice's measurements.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
              {Object.entries(simResult.measurement_counts).map(([state, count]) => {
                if (count === 0) return null;
                const bobVerification = state[0]; // Leftmost bit is c2
                const aliceState = state.slice(1);
                
                return (
                  <div key={state} style={{ padding: '1rem', border: '1px solid var(--border-light)', flex: '1 1 200px' }}>
                    <div className="text-mono" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                      {state}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Count: {count} <br/>
                      Alice transmitted: {aliceState} <br/>
                      <span style={{ color: bobVerification === '0' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        Bob Verification (c2): {bobVerification}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--accent-green)' }}>
              <strong className="text-green">SUCCESS:</strong> Notice that no matter what classical bits Alice transmitted (00, 01, 10, or 11), Bob's verification bit (<code>c2</code>) is <strong>ALWAYS 0</strong>. This mathematically proves Bob successfully received and corrected the arbitrary payload state!
            </div>
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
            onClick={() => setLessonComplete(true)}
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
          >
            MARK MODULE COMPLETE
          </button>
        )}
      </div>
    </LessonLayout>
  );
};

export default TeleportationLesson;
