import { useState, useCallback } from 'react';
import CircuitControls from '../features/lab/components/CircuitControls';
import GatePalette from '../features/lab/components/GatePalette';
import CircuitGrid from '../features/lab/components/CircuitGrid';
import SimulationResults from '../features/lab/components/SimulationResults';
import { gridToCircuitDefinition } from '../features/lab/utils/circuitParser';
import { simulateCircuit } from '../services/quantumApi';

const COLUMNS = 8;
const generateEmptyRow = () => Array(COLUMNS).fill(null);

const Lab = () => {
  const [numQubits, setNumQubitsState] = useState(2);
  const [shots, setShots] = useState(1000);
  const [grid, setGrid] = useState([generateEmptyRow(), generateEmptyRow()]);
  
  const [selectedGate, setSelectedGate] = useState(null);
  const [pendingCX, setPendingCX] = useState(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState(null);

  // Clear stale results automatically when structural or configuration state changes
  const [prevGridRef, setPrevGridRef] = useState(grid);
  const [prevShotsRef, setPrevShotsRef] = useState(shots);
  const [prevNumQubitsRef, setPrevNumQubitsRef] = useState(numQubits);

  if (grid !== prevGridRef || shots !== prevShotsRef || numQubits !== prevNumQubitsRef) {
    setPrevGridRef(grid);
    setPrevShotsRef(shots);
    setPrevNumQubitsRef(numQubits);
    if (simulationResult || simulationError) {
      setSimulationResult(null);
      setSimulationError(null);
    }
  }

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

  const handleRunSimulation = async () => {
    if (isSimulating) return;

    try {
      setIsSimulating(true);
      setSimulationError(null);
      setSimulationResult(null);

      const circuitDef = gridToCircuitDefinition(grid, numQubits, shots);
      const result = await simulateCircuit(circuitDef);
      
      setSimulationResult(result);
    } catch (err) {
      console.error("Simulation execution error:", err);
      setSimulationError("Unable to execute circuit. Please verify your operations and try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
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

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={handleRunSimulation}
          disabled={isSimulating}
          style={{ 
            fontSize: '1.2rem', 
            padding: '1rem 3rem',
            backgroundColor: isSimulating ? 'var(--bg-panel)' : 'var(--accent-blue)',
            color: isSimulating ? 'var(--text-dim)' : 'var(--bg-dark)',
            borderColor: 'var(--accent-blue)',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            cursor: isSimulating ? 'not-allowed' : 'pointer'
          }}
        >
          {isSimulating ? 'EXECUTING QUANTUM CIRCUIT...' : 'RUN SIMULATION'}
        </button>
      </div>

      {simulationError && (
        <div className="sci-panel" style={{ marginTop: '2rem', borderColor: 'var(--accent-red)' }}>
          <div className="tech-label text-red" style={{ marginBottom: '0.5rem' }}>SIMULATION ERROR</div>
          <p className="text-white" style={{ margin: 0 }}>{simulationError}</p>
        </div>
      )}

      {simulationResult && (
        <SimulationResults result={simulationResult} />
      )}
    </div>
  );
};

export default Lab;
