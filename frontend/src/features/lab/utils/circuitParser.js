export const gridToCircuitDefinition = (grid, numQubits, shots) => {
  const operations = [];
  const numSteps = grid[0]?.length || 0;

  for (let col = 0; col < numSteps; col++) {
    for (let row = 0; row < numQubits; row++) {
      const cell = grid[row][col];
      if (!cell) continue;

      if (cell.type === 'CX-T') {
        // Ignored because CX-C generates the backend operation
        continue;
      }

      if (cell.type === 'CX-C') {
        operations.push({ gate: 'CX', control: row, target: cell.target });
      } else {
        // Standard gates (H, X, Y, Z, etc.)
        operations.push({ gate: cell.type, target: row });
      }
    }
  }

  return {
    num_qubits: numQubits,
    shots: shots,
    operations: operations,
    return_statevector: true
  };
};
