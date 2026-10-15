export const CHALLENGES = [
  {
    id: 'state-prep-1',
    number: 1,
    numStr: '01',
    code: 'CHALLENGE-01',
    title: 'State Preparation I',
    subtitle: 'The Computational Basis Flip',
    difficulty: 'Beginner',
    difficultyColor: 'var(--accent-blue)',
    numQubits: 1,
    defaultShots: 1000,
    objective: 'Prepare the quantum state |1⟩ from the initial ground state |0⟩.',
    requiredSolution: 'Apply a Pauli-X gate to qubit Q0.',
    hint: 'The Pauli-X gate acts as a quantum bit-flip (NOT gate), rotating the qubit state vector by π radians around the X-axis of the Bloch sphere, deterministically mapping |0⟩ to |1⟩.',
    successCriteria: 'Measurement outcome 1 with probability 1.0 (allowing for minor sampling variance if shot-based), and statevector fidelity F(|1⟩, |ψ⟩) = 1.0.',
    explanation: 'The Pauli-X gate acts as the quantum analogue of a classical inverter (NOT gate). When applied to the initial ground state |0⟩, it flips the amplitude to |1⟩. In the computational basis, measuring this state yields outcome "1" with 100% certainty.',
    targetState: [
      { real: 0, imag: 0 },
      { real: 1, imag: 0 }
    ],
    targetDescription: '|1⟩ = [0, 1]'
  },
  {
    id: 'state-prep-2',
    number: 2,
    numStr: '02',
    code: 'CHALLENGE-02',
    title: 'State Preparation II',
    subtitle: 'Generating Quantum Superposition',
    difficulty: 'Beginner',
    difficultyColor: 'var(--accent-blue)',
    numQubits: 1,
    defaultShots: 1000,
    objective: 'Prepare the equal superposition state |+⟩ = (|0⟩ + |1⟩) / √2.',
    requiredSolution: 'Apply a Hadamard (H) gate to qubit Q0.',
    hint: 'The Hadamard (H) gate maps computational basis states into balanced superpositions. Applying H to |0⟩ creates the |+⟩ state with equal real amplitudes (1/√2 ≈ 0.7071) and zero relative phase.',
    successCriteria: 'Measurement probabilities approximately 50% for "0" and 50% for "1" (within statistical shot variance), and statevector fidelity F(|+⟩, |ψ⟩) ≈ 1.0.',
    explanation: 'The Hadamard (H) gate creates an equal superposition |+⟩ = (|0⟩ + |1⟩)/√2. The state points directly along the positive X-axis of the Bloch sphere. Measurement in the computational Z-basis yields 0 or 1 with equal 50% probability.',
    targetState: [
      { real: 1 / Math.SQRT2, imag: 0 },
      { real: 1 / Math.SQRT2, imag: 0 }
    ],
    targetDescription: '|+⟩ = (|0⟩ + |1⟩) / √2'
  },
  {
    id: 'state-prep-3',
    number: 3,
    numStr: '03',
    code: 'CHALLENGE-03',
    title: 'State Preparation III',
    subtitle: 'The Phase-Encoded State |−⟩',
    difficulty: 'Intermediate',
    difficultyColor: 'var(--accent-amber)',
    numQubits: 1,
    defaultShots: 1000,
    objective: 'Prepare the state |−⟩ = (|0⟩ − |1⟩) / √2.',
    requiredSolution: 'Apply an X gate followed by an H gate to Q0, or an equivalent circuit producing the same state up to global phase (such as H followed by Z).',
    hint: 'Notice that |−⟩ and |+⟩ produce identical 50/50 measurement distributions in the computational basis, but |−⟩ possesses a relative phase difference of π (a negative amplitude on |1⟩). Remember: H|1⟩ = |−⟩, and X flips |0⟩ to |1⟩. Alternatively, applying Z to |+⟩ flips its relative phase.',
    successCriteria: 'Quantum state fidelity F(|−⟩, |ψ⟩) ≈ 1.0 up to global phase. Because computational measurements alone cannot distinguish |+⟩ from |−⟩, validation requires true complex statevector verification.',
    explanation: 'You prepared the |−⟩ state! While |+⟩ and |−⟩ yield identical 50/50 measurement statistics in the computational basis, they are mutually orthogonal quantum states pointing in opposite directions along the X-axis of the Bloch sphere. Applying X then H (or H then Z) correctly encodes this relative phase.',
    targetState: [
      { real: 1 / Math.SQRT2, imag: 0 },
      { real: -1 / Math.SQRT2, imag: 0 }
    ],
    targetDescription: '|−⟩ = (|0⟩ − |1⟩) / √2'
  },
  {
    id: 'state-prep-4',
    number: 4,
    numStr: '04',
    code: 'CHALLENGE-04',
    title: 'State Preparation IV',
    subtitle: 'Two-Qubit Bell State Entanglement',
    difficulty: 'Intermediate',
    difficultyColor: 'var(--accent-amber)',
    numQubits: 2,
    defaultShots: 1000,
    objective: 'Prepare the maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2 using two qubits.',
    requiredSolution: 'Apply an H gate to Q0, followed by a CNOT (CX) gate with Q0 as control and Q1 as target.',
    hint: 'To create maximal entanglement, first put the control qubit Q0 into an equal superposition with H. Then entangle Q0 with target qubit Q1 using a CNOT (CX) gate with Q0 as control and Q1 as target.',
    successCriteria: 'Correlated measurement outcomes ("00" and "11") with approximately equal 50% probabilities, statevector fidelity F(|Φ+⟩, |ψ⟩) ≈ 1.0, and positive quantum concurrence confirming genuine entanglement.',
    explanation: 'You generated the maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2! In this entangled state, the two qubits cannot be described by independent individual states. Measuring qubit 0 instantaneously dictates the outcome of qubit 1 with 100% correlation.',
    targetState: [
      { real: 1 / Math.SQRT2, imag: 0 },
      { real: 0, imag: 0 },
      { real: 0, imag: 0 },
      { real: 1 / Math.SQRT2, imag: 0 }
    ],
    targetDescription: '|Φ+⟩ = (|00⟩ + |11⟩) / √2'
  }
];

export const getChallengeById = (id) => {
  return CHALLENGES.find(c => c.id === id) || null;
};
