import { CHALLENGES } from '../data/challengesData';

/**
 * Computes the quantum state fidelity F = |⟨target|candidate⟩|² between two pure states.
 * This handles any global phase e^(iθ) with mathematical invariance.
 *
 * @param {Array<{real: number, imag: number}>} targetState
 * @param {Array<{real: number, imag: number}>} candidateState
 * @returns {number} Fidelity value in [0, 1]
 */
export const calculateFidelity = (targetState, candidateState) => {
  if (!Array.isArray(targetState) || !Array.isArray(candidateState)) {
    return 0;
  }
  if (targetState.length === 0 || targetState.length !== candidateState.length) {
    return 0;
  }

  let sumReal = 0;
  let sumImag = 0;
  let normTarget = 0;
  let normCandidate = 0;

  for (let k = 0; k < targetState.length; k++) {
    const tR = targetState[k]?.real || 0;
    const tI = targetState[k]?.imag || 0;
    const cR = candidateState[k]?.real || 0;
    const cI = candidateState[k]?.imag || 0;

    // ⟨target|candidate⟩ = ∑ (tR - i*tI) * (cR + i*cI)
    // = (tR*cR + tI*cI) + i * (tR*cI - tI*cR)
    sumReal += (tR * cR + tI * cI);
    sumImag += (tR * cI - tI * cR);

    normTarget += (tR * tR + tI * tI);
    normCandidate += (cR * cR + cI * cI);
  }

  if (normTarget <= 0 || normCandidate <= 0) {
    return 0;
  }

  const squaredInnerProduct = (sumReal * sumReal) + (sumImag * sumImag);
  const normalizedFidelity = squaredInnerProduct / (normTarget * normCandidate);

  // Clamp numerical rounding errors
  return Math.min(1.0, Math.max(0.0, normalizedFidelity));
};

/**
 * Calculates Wootters' Concurrence C(|ψ⟩) for a 2-qubit pure state.
 * C = 2 * |c00 * c11 - c01 * c10|
 * C = 0 for separable (unentangled) product states.
 * C = 1 for maximally entangled Bell states.
 *
 * @param {Array<{real: number, imag: number}>} statevector (length 4)
 * @returns {number} Concurrence in [0, 1]
 */
export const calculateConcurrence = (statevector) => {
  if (!Array.isArray(statevector) || statevector.length !== 4) {
    return 0;
  }

  const c00 = statevector[0] || { real: 0, imag: 0 };
  const c01 = statevector[1] || { real: 0, imag: 0 };
  const c10 = statevector[2] || { real: 0, imag: 0 };
  const c11 = statevector[3] || { real: 0, imag: 0 };

  // prodA = c00 * c11
  const prodAReal = c00.real * c11.real - c00.imag * c11.imag;
  const prodAImag = c00.real * c11.imag + c00.imag * c11.real;

  // prodB = c01 * c10
  const prodBReal = c01.real * c10.real - c01.imag * c10.imag;
  const prodBImag = c01.real * c10.imag + c01.imag * c10.real;

  // diff = prodA - prodB
  const diffReal = prodAReal - prodBReal;
  const diffImag = prodAImag - prodBImag;

  const magnitude = Math.sqrt(diffReal * diffReal + diffImag * diffImag);
  const concurrence = 2.0 * magnitude;

  return Math.min(1.0, Math.max(0.0, concurrence));
};

// Canonical comparison states for diagnostics
const STATE_ZERO = [{ real: 1, imag: 0 }, { real: 0, imag: 0 }];
const STATE_ONE = [{ real: 0, imag: 0 }, { real: 1, imag: 0 }];
const STATE_PLUS = [{ real: 1 / Math.SQRT2, imag: 0 }, { real: 1 / Math.SQRT2, imag: 0 }];
const STATE_MINUS = [{ real: 1 / Math.SQRT2, imag: 0 }, { real: -1 / Math.SQRT2, imag: 0 }];

// Bell states
const BELL_PHI_MINUS = [
  { real: 1 / Math.SQRT2, imag: 0 },
  { real: 0, imag: 0 },
  { real: 0, imag: 0 },
  { real: -1 / Math.SQRT2, imag: 0 }
];
const BELL_PSI_PLUS = [
  { real: 0, imag: 0 },
  { real: 1 / Math.SQRT2, imag: 0 },
  { real: 1 / Math.SQRT2, imag: 0 },
  { real: 0, imag: 0 }
];

/**
 * Evaluates a submitted circuit and its simulation results against a specific challenge.
 *
 * @param {object} params
 * @param {string} params.challengeId
 * @param {object} params.circuitDef - CircuitDefinition sent to simulation backend
 * @param {object} params.simulationResult - SimulationResult returned by backend
 * @returns {object} Structured evaluation result
 */
export const evaluateChallengeSolution = ({ challengeId, circuitDef, simulationResult }) => {
  const challenge = CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) {
    return {
      success: false,
      summaryTitle: 'Unknown Challenge',
      details: ['The specified challenge ID was not found.'],
      errorDiagnosis: 'Invalid challenge reference.'
    };
  }

  const operations = circuitDef?.operations || [];
  const counts = simulationResult?.measurement_counts || {};
  const statevector = simulationResult?.statevector || null;

  // Handle empty circuits
  if (operations.length === 0) {
    return {
      success: false,
      fidelity: 0,
      counts,
      concurrence: 0,
      summaryTitle: 'Empty Circuit Submitted',
      details: [
        'No quantum gates were placed on the circuit board.',
        'Qubits automatically initialize in the ground state |0⟩.'
      ],
      errorDiagnosis: `Place the required quantum gate(s) on the circuit grid to achieve the objective: ${challenge.objective}`,
      quantumConcept: 'Quantum circuits default to the ground state |0...0⟩ upon initialization until modified by unitary transformations.'
    };
  }

  // Handle missing statevector (e.g. if explicit M gate was used or backend error)
  if (!statevector || !Array.isArray(statevector)) {
    return {
      success: false,
      fidelity: 0,
      counts,
      summaryTitle: 'Statevector Not Available',
      details: ['The backend simulation did not return pre-measurement state amplitudes.'],
      errorDiagnosis: 'Ensure statevector extraction is enabled and no explicit measurement gates block the statevector readout.',
      quantumConcept: 'Exact state verification requires examining the complex probability amplitudes of the pre-measurement pure state.'
    };
  }

  // Calculate fidelity against target state
  const targetFidelity = calculateFidelity(challenge.targetState, statevector);

  // Total shots observed
  const totalCounts = Object.values(counts).reduce((a, b) => a + b, 0);

  // -------------------------------------------------------------
  // CHALLENGE 01: State Preparation I (|1⟩ from |0⟩)
  // -------------------------------------------------------------
  if (challenge.id === 'state-prep-1') {
    const countOne = counts['1'] || 0;
    const probOne = totalCounts > 0 ? countOne / totalCounts : 0;
    const isStateCorrect = targetFidelity >= 0.999;
    const isMeasurementCorrect = probOne >= 0.98;

    if (isStateCorrect && isMeasurementCorrect) {
      return {
        success: true,
        fidelity: targetFidelity,
        counts,
        summaryTitle: 'Challenge 01 Completed: State |1⟩ Prepared',
        details: [
          `Statevector fidelity F(|1⟩, |ψ⟩): ${(targetFidelity * 100).toFixed(1)}%`,
          `Measurement outcome "1": ${(probOne * 100).toFixed(1)}% (${countOne}/${totalCounts} shots)`
        ],
        quantumConcept: challenge.explanation
      };
    }

    // Diagnostics
    let diagnosis;
    const fidelityZero = calculateFidelity(STATE_ZERO, statevector);
    const fidelityPlus = calculateFidelity(STATE_PLUS, statevector);

    if (fidelityZero > 0.95) {
      diagnosis = 'The qubit is still in the ground state |0⟩. A Pauli-X gate acts as a bit-flip (NOT) gate to rotate |0⟩ to |1⟩.';
    } else if (fidelityPlus > 0.95) {
      diagnosis = 'An H gate was applied, generating the superposition state |+⟩ with a 50/50 measurement distribution. Challenge 01 requires the deterministic basis state |1⟩.';
    } else {
      diagnosis = `Observed state fidelity is ${(targetFidelity * 100).toFixed(1)}% with ${probOne * 100}% |1⟩ outcomes. Apply a Pauli-X gate to Q0.`;
    }

    return {
      success: false,
      fidelity: targetFidelity,
      counts,
      summaryTitle: 'Solution Incomplete',
      details: [
        `Target State: ${challenge.targetDescription}`,
        `Current State Fidelity: ${(targetFidelity * 100).toFixed(1)}%`,
        `Outcome "1" Probability: ${(probOne * 100).toFixed(1)}% (Expected: 100%)`
      ],
      errorDiagnosis: diagnosis,
      quantumConcept: 'The Pauli-X gate performs a π rotation about the X axis of the Bloch sphere, flipping |0⟩ to |1⟩.'
    };
  }

  // -------------------------------------------------------------
  // CHALLENGE 02: State Preparation II (|+⟩ superposition)
  // -------------------------------------------------------------
  if (challenge.id === 'state-prep-2') {
    const countZero = counts['0'] || 0;
    const countOne = counts['1'] || 0;
    const p0 = totalCounts > 0 ? countZero / totalCounts : 0;
    const p1 = totalCounts > 0 ? countOne / totalCounts : 0;

    const isStateCorrect = targetFidelity >= 0.99;
    // Allow statistical tolerance for shots (0.38 - 0.62)
    const isMeasurementBalanced = p0 >= 0.38 && p0 <= 0.62 && p1 >= 0.38 && p1 <= 0.62;

    if (isStateCorrect && isMeasurementBalanced) {
      return {
        success: true,
        fidelity: targetFidelity,
        counts,
        summaryTitle: 'Challenge 02 Completed: Superposition |+⟩ Prepared',
        details: [
          `Statevector fidelity F(|+⟩, |ψ⟩): ${(targetFidelity * 100).toFixed(1)}%`,
          `Measurement statistics: "0" = ${(p0 * 100).toFixed(1)}%, "1" = ${(p1 * 100).toFixed(1)}%`
        ],
        quantumConcept: challenge.explanation
      };
    }

    // Diagnostics
    let diagnosis = 'The circuit did not prepare the equal superposition state |+⟩.';
    const fidelityMinus = calculateFidelity(STATE_MINUS, statevector);
    const fidelityZero = calculateFidelity(STATE_ZERO, statevector);
    const fidelityOne = calculateFidelity(STATE_ONE, statevector);

    if (fidelityMinus > 0.95) {
      diagnosis = 'Phase Inversion: Your circuit created state |−⟩ = (|0⟩ - |1⟩)/√2 instead of |+⟩. While both yield 50/50 measurement probabilities, |−⟩ has a negative relative phase. Apply an H gate directly to |0⟩.';
    } else if (fidelityZero > 0.95) {
      diagnosis = 'The qubit remains in classical state |0⟩ with 100% certainty. Apply an H (Hadamard) gate to create equal superposition.';
    } else if (fidelityOne > 0.95) {
      diagnosis = 'The qubit is in classical state |1⟩. An H gate on |0⟩ creates |+⟩, whereas an H gate on |1⟩ creates |−⟩.';
    }

    return {
      success: false,
      fidelity: targetFidelity,
      counts,
      summaryTitle: 'Solution Incomplete',
      details: [
        `Target State: ${challenge.targetDescription}`,
        `Current State Fidelity: ${(targetFidelity * 100).toFixed(1)}%`,
        `Outcomes: "0": ${(p0 * 100).toFixed(1)}%, "1": ${(p1 * 100).toFixed(1)}%`
      ],
      errorDiagnosis: diagnosis,
      quantumConcept: 'The Hadamard gate maps computational basis states into superpositions: H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2.'
    };
  }

  // -------------------------------------------------------------
  // CHALLENGE 03: State Preparation III (|−⟩ phase-encoded state)
  // -------------------------------------------------------------
  if (challenge.id === 'state-prep-3') {
    const countZero = counts['0'] || 0;
    const countOne = counts['1'] || 0;
    const p0 = totalCounts > 0 ? countZero / totalCounts : 0;
    const p1 = totalCounts > 0 ? countOne / totalCounts : 0;

    const isStateCorrect = targetFidelity >= 0.99;
    const isMeasurementBalanced = p0 >= 0.38 && p0 <= 0.62 && p1 >= 0.38 && p1 <= 0.62;

    if (isStateCorrect && isMeasurementBalanced) {
      return {
        success: true,
        fidelity: targetFidelity,
        counts,
        summaryTitle: 'Challenge 03 Completed: Phase-Encoded State |−⟩ Prepared',
        details: [
          `Statevector fidelity F(|−⟩, |ψ⟩): ${(targetFidelity * 100).toFixed(1)}% (relative phase verified)`,
          `Measurement statistics: "0" = ${(p0 * 100).toFixed(1)}%, "1" = ${(p1 * 100).toFixed(1)}%`
        ],
        quantumConcept: challenge.explanation
      };
    }

    // Critical Quantum Check: Did the user submit |+⟩ thinking 50/50 counts was enough?
    const fidelityPlus = calculateFidelity(STATE_PLUS, statevector);
    let diagnosis = 'The circuit did not prepare state |−⟩.';

    if (fidelityPlus >= 0.95) {
      diagnosis = 'PHASE MISMATCH: Your circuit produced measurement outcomes of ~50% |0⟩ and ~50% |1⟩, but the quantum state is |+⟩, NOT |−⟩! In the computational Z-basis, |+⟩ and |−⟩ have identical measurement probabilities, but |−⟩ has a relative phase difference of π on |1⟩. To prepare |−⟩, apply an X gate before H (since H|1⟩ = |−⟩), or apply a Z gate after H.';
    } else if (calculateFidelity(STATE_ZERO, statevector) > 0.95) {
      diagnosis = 'The qubit is in state |0⟩. A superposition with relative phase is required.';
    } else if (calculateFidelity(STATE_ONE, statevector) > 0.95) {
      diagnosis = 'The qubit is in state |1⟩. Apply an H gate after the X gate to enter the |−⟩ state.';
    }

    return {
      success: false,
      fidelity: targetFidelity,
      counts,
      summaryTitle: 'Solution Incomplete',
      details: [
        `Target State: ${challenge.targetDescription}`,
        `Current State Fidelity with |−⟩: ${(targetFidelity * 100).toFixed(1)}%`,
        `Fidelity with |+⟩: ${(fidelityPlus * 100).toFixed(1)}%`,
        `Outcomes: "0": ${(p0 * 100).toFixed(1)}%, "1": ${(p1 * 100).toFixed(1)}%`
      ],
      errorDiagnosis: diagnosis,
      quantumConcept: 'Computational-basis measurements alone cannot differentiate states that differ only in relative phase. Exact statevector fidelity distinguishes |+⟩ from |−⟩.'
    };
  }

  // -------------------------------------------------------------
  // CHALLENGE 04: State Preparation IV (Bell state |Φ+⟩)
  // -------------------------------------------------------------
  if (challenge.id === 'state-prep-4') {
    const count00 = counts['00'] || 0;
    const count11 = counts['11'] || 0;
    const count01 = counts['01'] || 0;
    const count10 = counts['10'] || 0;

    const p00 = totalCounts > 0 ? count00 / totalCounts : 0;
    const p11 = totalCounts > 0 ? count11 / totalCounts : 0;
    const pCorrelated = p00 + p11;

    const concurrence = calculateConcurrence(statevector);
    const isStateCorrect = targetFidelity >= 0.99;
    const isEntangled = concurrence >= 0.95;
    const isCorrelated = pCorrelated >= 0.95 && p00 >= 0.38 && p00 <= 0.62 && p11 >= 0.38 && p11 <= 0.62;

    if (isStateCorrect && isEntangled && isCorrelated) {
      return {
        success: true,
        fidelity: targetFidelity,
        concurrence,
        counts,
        summaryTitle: 'Challenge 04 Completed: Bell State |Φ⁺⟩ Prepared',
        details: [
          `Statevector fidelity F(|Φ⁺⟩, |ψ⟩): ${(targetFidelity * 100).toFixed(1)}%`,
          `Quantum Concurrence: ${concurrence.toFixed(2)} (Maximally Entangled)`,
          `Correlated outcomes: "00" = ${(p00 * 100).toFixed(1)}%, "11" = ${(p11 * 100).toFixed(1)}%`
        ],
        quantumConcept: challenge.explanation
      };
    }

    // Diagnostics
    let diagnosis = 'The circuit did not prepare the target Bell state |Φ⁺⟩.';

    const fidelityPsiPlus = calculateFidelity(BELL_PSI_PLUS, statevector);
    const fidelityPhiMinus = calculateFidelity(BELL_PHI_MINUS, statevector);

    // Check if CX occurred before H
    const cxOpIndex = operations.findIndex(op => op.gate === 'CX');
    const hOpIndex = operations.findIndex(op => op.gate === 'H' && op.target === 0);

    if (cxOpIndex !== -1 && hOpIndex !== -1 && cxOpIndex < hOpIndex) {
      diagnosis = 'Gate Ordering Error: CX was placed before H on Q0. Because Q0 starts in state |0⟩, the CNOT control never triggers, leaving Q1 in |0⟩. Place H on Q0 first, then apply CX.';
    } else if (cxOpIndex === -1) {
      diagnosis = `Entanglement Missing (Concurrence = ${concurrence.toFixed(2)}): The two qubits are in an unentangled product state. You must apply a two-qubit entangling gate (CX) with Q0 as control and Q1 as target.`;
    } else if (fidelityPsiPlus > 0.95) {
      diagnosis = 'You generated the Bell state |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2 with anti-correlated outcomes ("01" and "10"). Challenge 04 requires |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 with correlated outcomes ("00" and "11").';
    } else if (fidelityPhiMinus > 0.95) {
      diagnosis = 'You generated |Φ⁻⟩ = (|00⟩ - |11⟩)/√2 with a relative phase of π. The target Bell state is |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.';
    } else if (concurrence < 0.5) {
      diagnosis = `Insufficient entanglement (Concurrence: ${concurrence.toFixed(2)}). Ensure Q0 receives an H gate, followed by a CNOT (CX) gate controlling Q1.`;
    }

    return {
      success: false,
      fidelity: targetFidelity,
      concurrence,
      counts,
      summaryTitle: 'Solution Incomplete',
      details: [
        `Target State: ${challenge.targetDescription}`,
        `Current State Fidelity: ${(targetFidelity * 100).toFixed(1)}%`,
        `Quantum Concurrence: ${concurrence.toFixed(2)} (Target: 1.00)`,
        `Outcomes: "00": ${(p00 * 100).toFixed(1)}%, "11": ${(p11 * 100).toFixed(1)}%, "01": ${(count01 / totalCounts * 100).toFixed(1)}%, "10": ${(count10 / totalCounts * 100).toFixed(1)}%`
      ],
      errorDiagnosis: diagnosis,
      quantumConcept: 'Generating a Bell state requires creating equal superposition on the control qubit, then entangling the target qubit with a CNOT gate: (|0⟩ + |1⟩)|0⟩ / √2 → (|00⟩ + |11⟩) / √2.'
    };
  }

  // Fallback for generic challenges
  return {
    success: targetFidelity >= 0.99,
    fidelity: targetFidelity,
    counts,
    summaryTitle: targetFidelity >= 0.99 ? 'Challenge Completed' : 'Solution Incomplete',
    details: [`Fidelity: ${(targetFidelity * 100).toFixed(1)}%`],
    errorDiagnosis: targetFidelity >= 0.99 ? null : 'Fidelity threshold not met.',
    quantumConcept: challenge.explanation
  };
};
