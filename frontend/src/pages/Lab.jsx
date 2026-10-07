import { useState, useCallback } from 'react';
import CircuitControls from '../features/lab/components/CircuitControls';
import GatePalette from '../features/lab/components/GatePalette';
import CircuitGrid from '../features/lab/components/CircuitGrid';

const COLUMNS = 8;
const generateEmptyRow = () => Array(COLUMNS).fill(null);

const Lab = () => {
  const [numQubits, setNumQubitsState] = useState(2);
  const [shots, setShots] = useState(1000);
  const [grid, setGrid] = useState([generateEmptyRow(), generateEmptyRow()]);
  
  const [selectedGate, setSelectedGate] = useState(null);
  const [pendingCX, setPendingCX] = useState(null);

  const setNumQubits = useCallback((newCount) => {
    setNumQubitsState((prev) => {
      if (newCount === prev) return prev;
      
      setPendingCX(null); // Cancel pending CX on resize

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        if (newCount > prev) {
          for (let i = prev; i < newCount; i++) {
            newGrid.push(generateEmptyRow());
          }
        } else {
          newGrid.splice(newCount);
          for (let row = 0; row < newCount; row++) {
            newGrid[row] = [...newGrid[row]];
            for (let col = 0; col < COLUMNS; col++) {
              const cell = newGrid[row][col];
              if (cell && cell.type === 'CX-C') {
                if (cell.target >= newCount) newGrid[row][col] = null;
              } else if (cell && cell.type === 'CX-T') {
                if (cell.control >= newCount) newGrid[row][col] = null;
              }
            }
          }
        }
        return newGrid;
      });
      return newCount;
    });
  }, []);

  const handleClear = useCallback(() => {
    setGrid((prevGrid) => prevGrid.map(() => generateEmptyRow()));
    setSelectedGate(null);
    setPendingCX(null);
  }, []);

  const handleSelectGate = useCallback((gate) => {
    setSelectedGate(gate);
    setPendingCX(null); // Cancels pending CX when selecting another gate
  }, []);

  const handleCellClick = useCallback((rIdx, cIdx) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => [...row]);
      const existingCell = newGrid[rIdx][cIdx];

      // Logic 1: CX pending state - wait for target
      if (pendingCX) {
        if (pendingCX.column !== cIdx) return prevGrid; // Must be in same column
        if (pendingCX.control === rIdx) return prevGrid; // Cannot be same row
        if (existingCell) return prevGrid; // Target cell must be empty
        // Create CNOT
        newGrid[pendingCX.control][cIdx] = { type: 'CX-C', target: rIdx };
        newGrid[rIdx][cIdx] = { type: 'CX-T', control: pendingCX.control };
        
        setPendingCX(null);
        return newGrid;
      }

      // Logic 2: Empty cell clearing
      if (!selectedGate) {
        if (existingCell && existingCell.type !== 'CX-C' && existingCell.type !== 'CX-T') {
          // Clear standard gate
          newGrid[rIdx][cIdx] = null;
        } else if (existingCell && (existingCell.type === 'CX-C' || existingCell.type === 'CX-T')) {
          // Clear CNOT pairs safely
          const pairRow = existingCell.type === 'CX-C' ? existingCell.target : existingCell.control;
          newGrid[rIdx][cIdx] = null;
          newGrid[pairRow][cIdx] = null;
        }
        return newGrid;
      }

      // Logic 3: Start CX placement
      if (selectedGate === 'CX') {
        if (existingCell) return prevGrid; // Cannot start CX on occupied cell
        setPendingCX({ control: rIdx, column: cIdx });
        return prevGrid; // Grid doesn't change yet
      }

      // Logic 4: Place standard gate
      if (existingCell && (existingCell.type === 'CX-C' || existingCell.type === 'CX-T')) {
        // Do not silently corrupt CNOT
        return prevGrid;
      }

      // Insert or replace standard gate
      newGrid[rIdx][cIdx] = { type: selectedGate };
      return newGrid;
    });
  }, [selectedGate, pendingCX]);

  return (
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>FREE EXPERIMENTATION</div>
        <h1 style={{ fontSize: '3.5rem' }}>Quantum Lab</h1>
      </div>

      <CircuitControls 
        numQubits={numQubits} 
        setNumQubits={setNumQubits} 
        shots={shots} 
        setShots={setShots} 
        onClear={handleClear} 
      />

      <GatePalette 
        selectedGate={selectedGate} 
        onSelectGate={handleSelectGate} 
      />

      <CircuitGrid 
        grid={grid}
        selectedGate={selectedGate}
        pendingCX={pendingCX}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default Lab;
