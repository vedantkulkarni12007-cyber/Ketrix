/* global process */
import assert from 'assert';
import {
  calculateFidelity,
  calculateConcurrence,
  evaluateChallengeSolution
} from './src/features/challenges/utils/quantumEvaluator.js';
import {
  getCompletedChallenges,
  markChallengeCompleted,
  resetChallengeCompletion,
  clearAllChallengeProgress,
  isChallengeCompleted
} from './src/features/challenges/utils/progressStorage.js';
import { CHALLENGES, getChallengeById } from './src/features/challenges/data/challengesData.js';

async function runChallengeTests() {
  console.log('\n--- QUANTUM CHALLENGES TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  const test = (name, fn) => {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ ${name}`);
      console.error(err);
      failed++;
    }
  };

  // 1. Quantum State Fidelity calculations
  test('calculateFidelity handles identical states and orthogonal states', () => {
    const state0 = [{ real: 1, imag: 0 }, { real: 0, imag: 0 }];
    const state1 = [{ real: 0, imag: 0 }, { real: 1, imag: 0 }];
    const statePlus = [{ real: 1 / Math.SQRT2, imag: 0 }, { real: 1 / Math.SQRT2, imag: 0 }];
    const stateMinus = [{ real: 1 / Math.SQRT2, imag: 0 }, { real: -1 / Math.SQRT2, imag: 0 }];

    assert.strictEqual(calculateFidelity(state0, state0), 1.0);
    assert.strictEqual(calculateFidelity(state1, state1), 1.0);
    assert.strictEqual(calculateFidelity(state0, state1), 0.0);
    assert.strictEqual(calculateFidelity(statePlus, statePlus), 1.0);
    assert.strictEqual(calculateFidelity(stateMinus, stateMinus), 1.0);
    assert.strictEqual(calculateFidelity(statePlus, stateMinus), 0.0);
    assert.ok(Math.abs(calculateFidelity(state0, statePlus) - 0.5) < 1e-6);
  });

  // 2. Global phase invariance of quantum fidelity
  test('calculateFidelity is invariant under arbitrary global phase e^(iθ)', () => {
    const statePlus = [{ real: 1 / Math.SQRT2, imag: 0 }, { real: 1 / Math.SQRT2, imag: 0 }];
    // Phase π: -|+⟩
    const statePlusNeg = [{ real: -1 / Math.SQRT2, imag: 0 }, { real: -1 / Math.SQRT2, imag: 0 }];
    // Phase π/2: i|+⟩
    const statePlusI = [{ real: 0, imag: 1 / Math.SQRT2 }, { real: 0, imag: 1 / Math.SQRT2 }];
    // Arbitrary angle θ = π/3: e^(iπ/3) |+⟩
    const cosTheta = Math.cos(Math.PI / 3) / Math.SQRT2;
    const sinTheta = Math.sin(Math.PI / 3) / Math.SQRT2;
    const statePlusPhase = [{ real: cosTheta, imag: sinTheta }, { real: cosTheta, imag: sinTheta }];

    assert.ok(Math.abs(calculateFidelity(statePlus, statePlusNeg) - 1.0) < 1e-6);
    assert.ok(Math.abs(calculateFidelity(statePlus, statePlusI) - 1.0) < 1e-6);
    assert.ok(Math.abs(calculateFidelity(statePlus, statePlusPhase) - 1.0) < 1e-6);
  });

  // 3. Concurrence entanglement verification
  test('calculateConcurrence correctly distinguishes entangled Bell states from product states', () => {
    // Bell state |Φ+⟩
    const bellPhiPlus = [
      { real: 1 / Math.SQRT2, imag: 0 },
      { real: 0, imag: 0 },
      { real: 0, imag: 0 },
      { real: 1 / Math.SQRT2, imag: 0 }
    ];
    // Product state |00⟩
    const prod00 = [
      { real: 1, imag: 0 },
      { real: 0, imag: 0 },
      { real: 0, imag: 0 },
      { real: 0, imag: 0 }
    ];
    // Product state |++⟩ = 1/2(|00⟩+|01⟩+|10⟩+|11⟩)
    const prodPlusPlus = [
      { real: 0.5, imag: 0 },
      { real: 0.5, imag: 0 },
      { real: 0.5, imag: 0 },
      { real: 0.5, imag: 0 }
    ];

    assert.ok(Math.abs(calculateConcurrence(bellPhiPlus) - 1.0) < 1e-6, 'Bell state must have concurrence = 1.0');
    assert.ok(Math.abs(calculateConcurrence(prod00) - 0.0) < 1e-6, '|00⟩ must have concurrence = 0.0');
    assert.ok(Math.abs(calculateConcurrence(prodPlusPlus) - 0.0) < 1e-6, '|++⟩ must have concurrence = 0.0');
  });

  // 4. Challenge 01 — Correct solution (X on Q0)
  test('Challenge 01: Valid X gate on Q0 passes evaluation', () => {
    const circuitDef = {
      num_qubits: 1,
      shots: 1000,
      operations: [{ gate: 'X', target: 0 }]
    };
    const simulationResult = {
      statevector: [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
      measurement_counts: { '1': 1000 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-1',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, true);
    assert.ok(evalRes.fidelity >= 0.999);
    assert.ok(evalRes.summaryTitle.includes('Completed'));
  });

  // 5. Challenge 01 — Empty circuit and incorrect gates
  test('Challenge 01: Empty circuit and incorrect gates are properly rejected', () => {
    // Empty circuit
    const emptyDef = { num_qubits: 1, shots: 1000, operations: [] };
    const emptySim = {
      statevector: [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
      measurement_counts: { '0': 1000 }
    };
    const evalEmpty = evaluateChallengeSolution({
      challengeId: 'state-prep-1',
      circuitDef: emptyDef,
      simulationResult: emptySim
    });
    assert.strictEqual(evalEmpty.success, false);
    assert.ok(evalEmpty.summaryTitle.includes('Empty Circuit'));

    // H gate instead of X
    const hDef = { num_qubits: 1, shots: 1000, operations: [{ gate: 'H', target: 0 }] };
    const hSim = {
      statevector: [{ real: 1 / Math.SQRT2, imag: 0 }, { real: 1 / Math.SQRT2, imag: 0 }],
      measurement_counts: { '0': 505, '1': 495 }
    };
    const evalH = evaluateChallengeSolution({
      challengeId: 'state-prep-1',
      circuitDef: hDef,
      simulationResult: hSim
    });
    assert.strictEqual(evalH.success, false);
    assert.ok(evalH.errorDiagnosis.includes('superposition'));
  });

  // 6. Challenge 02 — Correct solution (H on Q0)
  test('Challenge 02: Valid H gate on Q0 passes evaluation', () => {
    const circuitDef = {
      num_qubits: 1,
      shots: 1000,
      operations: [{ gate: 'H', target: 0 }]
    };
    const simulationResult = {
      statevector: [{ real: 1 / Math.SQRT2, imag: 0 }, { real: 1 / Math.SQRT2, imag: 0 }],
      measurement_counts: { '0': 512, '1': 488 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-2',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, true);
    assert.ok(evalRes.fidelity >= 0.99);
  });

  // 7. Challenge 02 — Incorrect solutions
  test('Challenge 02: Classical basis state |1⟩ or |0⟩ is rejected', () => {
    const circuitDef = {
      num_qubits: 1,
      shots: 1000,
      operations: [{ gate: 'X', target: 0 }]
    };
    const simulationResult = {
      statevector: [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
      measurement_counts: { '1': 1000 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-2',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, false);
    assert.ok(evalRes.errorDiagnosis.includes('classical state |1⟩'));
  });

  // 8. Challenge 03 — Critical distinction: |+⟩ versus |−⟩
  test('Challenge 03: Correctly differentiates |−⟩ from |+⟩ despite identical measurement probabilities', () => {
    // Both states have ~50% 0 and ~50% 1 measurement statistics!
    const counts5050 = { '0': 502, '1': 498 };

    // Submitting |+⟩ (applying only H)
    const plusCircuit = {
      num_qubits: 1,
      shots: 1000,
      operations: [{ gate: 'H', target: 0 }]
    };
    const plusSim = {
      statevector: [{ real: 1 / Math.SQRT2, imag: 0 }, { real: 1 / Math.SQRT2, imag: 0 }],
      measurement_counts: counts5050
    };
    const evalPlus = evaluateChallengeSolution({
      challengeId: 'state-prep-3',
      circuitDef: plusCircuit,
      simulationResult: plusSim
    });

    assert.strictEqual(evalPlus.success, false, '|+⟩ must NOT pass Challenge 03 for |−⟩');
    assert.strictEqual(evalPlus.fidelity, 0.0, 'Fidelity between |+⟩ and |−⟩ is exactly 0');
    assert.ok(evalPlus.errorDiagnosis.includes('PHASE MISMATCH'), 'Must explicitly flag phase mismatch');
    assert.ok(evalPlus.errorDiagnosis.includes('relative phase'), 'Must explain relative phase difference');

    // Submitting |−⟩ (applying X then H)
    const minusCircuit = {
      num_qubits: 1,
      shots: 1000,
      operations: [{ gate: 'X', target: 0 }, { gate: 'H', target: 0 }]
    };
    const minusSim = {
      statevector: [{ real: 1 / Math.SQRT2, imag: 0 }, { real: -1 / Math.SQRT2, imag: 0 }],
      measurement_counts: counts5050
    };
    const evalMinus = evaluateChallengeSolution({
      challengeId: 'state-prep-3',
      circuitDef: minusCircuit,
      simulationResult: minusSim
    });

    assert.strictEqual(evalMinus.success, true, 'X then H must pass Challenge 03');
    assert.ok(evalMinus.fidelity >= 0.999);
  });

  // 9. Challenge 03 — Equivalent valid solutions (H then Z)
  test('Challenge 03: Equivalent solution H then Z passes evaluation', () => {
    const circuitDef = {
      num_qubits: 1,
      shots: 1000,
      operations: [{ gate: 'H', target: 0 }, { gate: 'Z', target: 0 }]
    };
    const simulationResult = {
      // H then Z produces [1/sqrt(2), -1/sqrt(2)]
      statevector: [{ real: 1 / Math.SQRT2, imag: 0 }, { real: -1 / Math.SQRT2, imag: 0 }],
      measurement_counts: { '0': 496, '1': 504 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-3',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, true);
    assert.ok(evalRes.fidelity >= 0.999);
  });

  // 10. Challenge 04 — Bell State (|Φ+⟩)
  test('Challenge 04: H on Q0 followed by CX(0,1) passes with entanglement verified', () => {
    const circuitDef = {
      num_qubits: 2,
      shots: 1000,
      operations: [
        { gate: 'H', target: 0 },
        { gate: 'CX', control: 0, target: 1 }
      ]
    };
    const simulationResult = {
      statevector: [
        { real: 1 / Math.SQRT2, imag: 0 },
        { real: 0, imag: 0 },
        { real: 0, imag: 0 },
        { real: 1 / Math.SQRT2, imag: 0 }
      ],
      measurement_counts: { '00': 508, '11': 492 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-4',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, true);
    assert.ok(evalRes.fidelity >= 0.999);
    assert.ok(evalRes.concurrence >= 0.99);
    assert.ok(evalRes.summaryTitle.includes('Completed'));
  });

  // 11. Challenge 04 — Gate ordering and unentangled circuits
  test('Challenge 04: CX before H is diagnosed as gate ordering error', () => {
    const circuitDef = {
      num_qubits: 2,
      shots: 1000,
      operations: [
        { gate: 'CX', control: 0, target: 1 },
        { gate: 'H', target: 0 }
      ]
    };
    const simulationResult = {
      // CX on |00> does nothing, then H on Q0 leaves state (|00> + |01>)/sqrt(2)
      statevector: [
        { real: 1 / Math.SQRT2, imag: 0 },
        { real: 1 / Math.SQRT2, imag: 0 },
        { real: 0, imag: 0 },
        { real: 0, imag: 0 }
      ],
      measurement_counts: { '00': 510, '01': 490 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-4',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, false);
    assert.ok(evalRes.errorDiagnosis.includes('Gate Ordering Error'));
  });

  test('Challenge 04: Two unentangled qubits (|++⟩) rejected with concurrence = 0', () => {
    const circuitDef = {
      num_qubits: 2,
      shots: 1000,
      operations: [
        { gate: 'H', target: 0 },
        { gate: 'H', target: 1 }
      ]
    };
    const simulationResult = {
      statevector: [
        { real: 0.5, imag: 0 },
        { real: 0.5, imag: 0 },
        { real: 0.5, imag: 0 },
        { real: 0.5, imag: 0 }
      ],
      measurement_counts: { '00': 255, '01': 245, '10': 252, '11': 248 }
    };
    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-4',
      circuitDef,
      simulationResult
    });
    assert.strictEqual(evalRes.success, false);
    assert.ok(evalRes.concurrence < 0.05);
    assert.ok(evalRes.errorDiagnosis.includes('Entanglement Missing'));
  });

  // 12. Persistence: progress tracking and storage resilience
  test('Progress persistence records completion, timestamps, and handles refresh/retry', () => {
    // Clear initial state
    clearAllChallengeProgress();
    assert.strictEqual(isChallengeCompleted('state-prep-1'), false);

    // Complete challenge 1
    markChallengeCompleted('state-prep-1', { fidelity: 1.0 });
    assert.strictEqual(isChallengeCompleted('state-prep-1'), true);

    const store = getCompletedChallenges();
    assert.ok(store['state-prep-1']);
    assert.strictEqual(store['state-prep-1'].completed, true);
    assert.ok(typeof store['state-prep-1'].completedAt === 'string');

    // Simulate page refresh (re-reading from storage)
    const refreshedStore = getCompletedChallenges();
    assert.strictEqual(refreshedStore['state-prep-1'].completed, true);

    // Complete challenge 2
    markChallengeCompleted('state-prep-2', { fidelity: 0.999 });
    const multiStore = getCompletedChallenges();
    assert.strictEqual(multiStore['state-prep-1'].completed, true);
    assert.strictEqual(multiStore['state-prep-2'].completed, true);

    // Retry / reset challenge 1
    resetChallengeCompletion('state-prep-1');
    assert.strictEqual(isChallengeCompleted('state-prep-1'), false);
    assert.strictEqual(isChallengeCompleted('state-prep-2'), true);

    // Clean up
    clearAllChallengeProgress();
  });

  // 13. API failure / missing statevector handling
  test('Graceful handling of missing statevectors without crash', () => {
    const circuitDef = { num_qubits: 1, shots: 1000, operations: [{ gate: 'X', target: 0 }] };
    const badSimResult = { measurement_counts: { '1': 1000 } }; // no statevector

    const evalRes = evaluateChallengeSolution({
      challengeId: 'state-prep-1',
      circuitDef,
      simulationResult: badSimResult
    });
    assert.strictEqual(evalRes.success, false);
    assert.ok(evalRes.summaryTitle.includes('Statevector Not Available'));
  });

  // 14. Challenge definitions check
  test('All 4 challenge definitions are valid and registered', () => {
    assert.strictEqual(CHALLENGES.length, 4);
    assert.strictEqual(getChallengeById('state-prep-1').number, 1);
    assert.strictEqual(getChallengeById('state-prep-2').number, 2);
    assert.strictEqual(getChallengeById('state-prep-3').number, 3);
    assert.strictEqual(getChallengeById('state-prep-4').number, 4);
  });

  console.log(`\nChallenge Tests Completed: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runChallengeTests();
