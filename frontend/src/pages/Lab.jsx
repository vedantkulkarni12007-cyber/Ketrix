import { useState, useCallback } from 'react';
import CircuitControls from '../features/lab/components/CircuitControls';
import GatePalette from '../features/lab/components/GatePalette';
import CircuitGrid from '../features/lab/components/CircuitGrid';
import SimulationResults from '../features/lab/components/SimulationResults';
import { gridToCircuitDefinition } from '../features/lab/utils/circuitParser';
import { simulateCircuit } from '../services/quantumApi';
import CoreStateVisualizer from '../features/visualization/CoreStateVisualizer';
import BlochSphere from '../features/visualization/BlochSphere';

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

  const clearSimulationState = useCallback(() => {
    if (simulationResult || simulationError) {
      setSimulationResult(null);
      setSimulationError(null);
    }
  }, [simulationResult, simulationError]);

  const setNumQubits = useCallback((newCount) => {
    setNumQubitsState((prev) => {
      if (newCount === prev) return prev;
      
      setPendingCX(null); // Cancel pending CX on resize
      clearSimulationState(); // Clear stale simulation data

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
  }, [clearSimulationState]);

  const handleClear = useCallback(() => {
    setGrid((prevGrid) => prevGrid.map(() => generateEmptyRow()));
    setSelectedGate(null);
    setPendingCX(null);
    clearSimulationState();
  }, [clearSimulationState]);

  const handleSelectGate = useCallback((gate) => {
    setSelectedGate(gate);
    setPendingCX(null); // Cancels pending CX when selecting another gate
  }, []);

  const handleCellClick = useCallback((rIdx, cIdx) => {
    clearSimulationState(); // Clear stale simulation data on edit

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
  }, [selectedGate, pendingCX, clearSimulationState]);

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
    <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1400px' }}>
      
      <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem', letterSpacing: '0.2em' }}>BUILD • EXECUTE • OBSERVE</div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>Quantum Laboratory</h1>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar: Controls & Palette */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2rem' }}>
          
          <div>
            <div className="tech-label" style={{ marginBottom: '0.75rem', color: 'var(--text-dim)', paddingLeft: '0.5rem' }}>ENVIRONMENT CONFIG</div>
            <CircuitControls 
              numQubits={numQubits} 
              setNumQubits={setNumQubits} 
              shots={shots} 
              setShots={(s) => { setShots(s); clearSimulationState(); }} 
              onClear={handleClear} 
            />
          </div>

          <div>
            <div className="tech-label" style={{ marginBottom: '0.75rem', color: 'var(--text-dim)', paddingLeft: '0.5rem' }}>QUANTUM GATES</div>
            <GatePalette 
              selectedGate={selectedGate} 
              onSelectGate={handleSelectGate} 
            />
          </div>

          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            style={{ 
              fontSize: '1.1rem', 
              padding: '1.2rem',
              backgroundColor: isSimulating ? 'var(--bg-panel)' : 'var(--accent-blue)',
              color: isSimulating ? 'var(--text-dim)' : 'var(--bg-dark)',
              borderColor: 'var(--accent-blue)',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              boxShadow: isSimulating ? 'none' : '0 0 20px rgba(56, 189, 248, 0.25)',
              outline: 'none',
              width: '100%',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              if (!isSimulating) {
                e.currentTarget.style.backgroundColor = '#7dd3fc';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSimulating) {
                e.currentTarget.style.backgroundColor = 'var(--accent-blue)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.25)';
              }
            }}
          >
            {isSimulating ? 'EXECUTING SIMULATION...' : 'RUN SIMULATION'}
          </button>
          
        </div>

        {/* Right Main Area: Circuit & Results */}
        <div style={{ flex: '2 1 700px', display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: 0 }}>
          
          <div className="sci-panel" style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--bg-dark)' }}>
            <div className="tech-label" style={{ marginBottom: '1.5rem', color: 'var(--text-dim)' }}>CIRCUIT BOARD ({COLUMNS} OPERATIONS MAX)</div>
            <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
              <CircuitGrid 
                grid={grid}
                selectedGate={selectedGate}
                pendingCX={pendingCX}
                onCellClick={handleCellClick}
              />
            </div>
            
            {pendingCX && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px dashed var(--accent-blue)', color: 'var(--accent-blue)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                CNOT CONTROL SELECTED. CLICK A TARGET QUBIT IN THE SAME COLUMN TO COMPLETE THE GATE.
              </div>
            )}
          </div>

          {simulationError && (
            <div className="sci-panel" style={{ borderColor: 'var(--accent-red)' }}>
              <div className="tech-label text-red" style={{ marginBottom: '0.5rem' }}>SIMULATION FAULT</div>
              <p className="text-white" style={{ margin: 0, fontSize: '1.1rem' }}>{simulationError}</p>
              <p style={{ marginTop: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Check that the simulation backend is running and try again.</p>
            </div>
          )}

          {!simulationResult && !simulationError && !isSimulating && (
            <div className="sci-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
              <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>AWAITING EXECUTION</div>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 0, fontSize: '1.1rem' }}>
                Build a circuit on the left and run the simulation <br/>to observe measurement outcomes.
              </p>
            </div>
          )}

          {simulationResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
              <div className="tech-label" style={{ color: 'var(--accent-green)', letterSpacing: '0.2em' }}>SIMULATION SUCCESSFUL // DATA RECEIVED</div>
              
              <div className="sci-panel" style={{ padding: '1.5rem', color: 'var(--text-secondary)', borderLeft: '4px solid var(--accent-blue)', backgroundColor: 'var(--bg-panel)' }}>
                <strong>Note:</strong> Measurement results are stochastic distributions based on {shots} shots. The statevector amplitudes represent the exact, theoretical pre-measurement pure state.
              </div>

              <SimulationResults result={simulationResult} />

              {simulationResult.statevector ? (
                <CoreStateVisualizer 
                  title="Statevector Analysis" 
                  desc="Theoretical complex amplitudes of the pre-measurement pure state."
                  statevector={simulationResult.statevector} 
                />
              ) : (
                <div className="sci-panel" style={{ padding: '2rem', color: 'var(--text-dim)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                  [STATEVECTOR UNAVAILABLE] PRE-MEASUREMENT STATE DATA COULD NOT BE RETRIEVED.
                </div>
              )}

              {simulationResult.statevector && numQubits === 1 && (
                <BlochSphere 
                  title="Bloch Sphere"
                  description="Geometric representation of the single-qubit pure state."
                  statevector={simulationResult.statevector} 
                />
              )}

              {simulationResult.statevector && numQubits > 1 && (
                <div className="sci-panel" style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-panel-light)' }}>
                  <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>BLOCH SPHERE RESTRICTION</div>
                  <p style={{ color: 'var(--text-dim)', margin: 0, lineHeight: '1.6' }}>
                    The Bloch Sphere geometric visualization is only mathematically defined for single-qubit pure states.
                    <br/>
                    This circuit contains <strong style={{ color: 'var(--text-primary)' }}>{numQubits}</strong> entangled or independent qubits.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Lab;
