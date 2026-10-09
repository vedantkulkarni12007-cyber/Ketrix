/* global process */
import React from 'react';
import { renderToString } from 'react-dom/server';
import assert from 'assert';
import { gridToCircuitDefinition } from './src/features/lab/utils/circuitParser.js';
import BlochSphere from './src/features/visualization/BlochSphere.jsx';
import CoreStateVisualizer from './src/features/visualization/CoreStateVisualizer.jsx';

async function runTests() {
  console.log('--- FRONTEND TESTS ---');
  let passed = 0;
  let failed = 0;

  const runTest = (name, fn) => {
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

  // 1. Circuit parser converts H, X, Y, Z and CX control/target pairs into the correct API operations.
  runTest('Circuit parser converts gates correctly', () => {
    const grid = [
      [{ type: 'H' }, null, { type: 'CX-C', target: 1 }],
      [null, { type: 'X' }, { type: 'CX-T', control: 0 }]
    ];
    const def = gridToCircuitDefinition(grid, 2, 1000);
    assert.deepEqual(def.operations, [
      { gate: 'H', target: 0 },
      { gate: 'X', target: 1 },
      { gate: 'CX', control: 0, target: 1 }
    ]);
  });

  // 2. Invalid or incomplete CX pairs are handled safely.
  runTest('Invalid or incomplete CX pairs are handled safely', () => {
    const grid = [
      [{ type: 'CX-C', target: 1 }, { type: 'CX-C', target: 5 }, null],
      [{ type: 'CX-T', control: 0 }, null, { type: 'CX-T', control: 0 }]
    ];
    const def = gridToCircuitDefinition(grid, 2, 1000); 
    // The parser only relies on CX-C to generate the backend operation.
    // Orphaned CX-T markers (like the one in column 2) are safely ignored.
    assert.deepEqual(def.operations, [
      { gate: 'CX', control: 0, target: 1 },
      { gate: 'CX', control: 0, target: 5 }
    ]);
  });

  // 3. Qubit and shot values are represented correctly in the simulation request.
  runTest('Qubit and shot values are represented correctly', () => {
    const def = gridToCircuitDefinition([], 5, 420);
    assert.strictEqual(def.num_qubits, 5);
    assert.strictEqual(def.shots, 420);
    assert.strictEqual(def.return_statevector, true);
  });

  // 5. Bloch sphere coordinates are correct for |0⟩, |1⟩, |+⟩, |−⟩, |i⟩ and |−i⟩.
  runTest('Bloch sphere coordinates are correct for basic states', () => {
    const checkCoords = (statevector, expX, expY, expZ) => {
      const html = renderToString(React.createElement(BlochSphere, { statevector }));
      try {
        assert(html.includes(`X: <!-- --> <span style="color:var(--text-primary)">${expX >= 0 ? ' ' : ''}${expX.toFixed(4)}</span>`) || html.includes(`X: <span style="color:var(--text-primary)">${expX >= 0 ? ' ' : ''}${expX.toFixed(4)}</span>`), `Missing X: ${expX}`);
        assert(html.includes(`Y: <!-- --> <span style="color:var(--text-primary)">${expY >= 0 ? ' ' : ''}${expY.toFixed(4)}</span>`) || html.includes(`Y: <span style="color:var(--text-primary)">${expY >= 0 ? ' ' : ''}${expY.toFixed(4)}</span>`), `Missing Y: ${expY}`);
        assert(html.includes(`Z: <!-- --> <span style="color:var(--text-primary)">${expZ >= 0 ? ' ' : ''}${expZ.toFixed(4)}</span>`) || html.includes(`Z: <span style="color:var(--text-primary)">${expZ >= 0 ? ' ' : ''}${expZ.toFixed(4)}</span>`), `Missing Z: ${expZ}`);
      } catch (e) {
        console.error(html);
        throw e;
      }
    };

    // |0⟩ = [1, 0] -> Z=1
    checkCoords([{ real: 1, imag: 0 }, { real: 0, imag: 0 }], 0, 0, 1);
    // |1⟩ = [0, 1] -> Z=-1
    checkCoords([{ real: 0, imag: 0 }, { real: 1, imag: 0 }], 0, 0, -1);
    // |+⟩ = [1/sqrt(2), 1/sqrt(2)] -> X=1
    checkCoords([{ real: 0.707106, imag: 0 }, { real: 0.707106, imag: 0 }], 1, 0, 0);
    // |−⟩ = [1/sqrt(2), -1/sqrt(2)] -> X=-1
    checkCoords([{ real: 0.707106, imag: 0 }, { real: -0.707106, imag: 0 }], -1, 0, 0);
    // |i⟩ = [1/sqrt(2), i/sqrt(2)] -> Y=1
    checkCoords([{ real: 0.707106, imag: 0 }, { real: 0, imag: 0.707106 }], 0, 1, 0);
    // |−i⟩ = [1/sqrt(2), -i/sqrt(2)] -> Y=-1
    checkCoords([{ real: 0.707106, imag: 0 }, { real: 0, imag: -0.707106 }], 0, -1, 0);
  });

  // 6. Invalid statevector input produces a safe fallback rather than a crash.
  runTest('Invalid statevector input produces safe fallback', () => {
    // Missing statevector
    let html = renderToString(React.createElement(BlochSphere, {}));
    assert(html.includes('[INVALID_STATE]'));

    // 2-qubit statevector (length 4)
    html = renderToString(React.createElement(BlochSphere, { statevector: [
      {real: 1, imag: 0}, {real: 0, imag: 0}, {real: 0, imag: 0}, {real: 0, imag: 0}
    ]}));
    assert(html.includes('[INVALID_STATE]'));

    // Unnormalized statevector
    html = renderToString(React.createElement(BlochSphere, { statevector: [
      {real: 0.5, imag: 0}, {real: 0.5, imag: 0}
    ]}));
    assert(html.includes('[INVALID_STATE]'));
  });

  // 4. Statevector probabilities are normalized correctly.
  runTest('Statevector probabilities are normalized correctly', () => {
    // Unnormalized statevector: [1, 1], magnitude = sqrt(2). Both should be 50.0%.
    const html = renderToString(React.createElement(CoreStateVisualizer, { statevector: [
      {real: 1, imag: 0}, {real: 1, imag: 0}
    ]}));
    
    try {
      assert(html.includes('50.0%') || html.includes('50.0<!-- -->%'), 'Should display 50.0% for unnormalized equal superposition');
    } catch (e) {
      console.error(html);
      throw e;
    }
  });

  console.log(`\nTests: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests();
