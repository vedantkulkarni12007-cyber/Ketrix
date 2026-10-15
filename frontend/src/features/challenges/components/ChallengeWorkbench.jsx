import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GatePalette from '../../lab/components/GatePalette';
import CircuitGrid from '../../lab/components/CircuitGrid';
import SimulationResults from '../../lab/components/SimulationResults';
import CoreStateVisualizer from '../../visualization/CoreStateVisualizer';
import BlochSphere from '../../visualization/BlochSphere';
import { gridToCircuitDefinition } from '../../lab/utils/circuitParser';
import { simulateCircuit } from '../../../services/quantumApi';
import { evaluateChallengeSolution } from '../utils/quantumEvaluator';
import { markChallengeCompleted, resetChallengeCompletion } from '../utils/progressStorage';
import { CHALLENGES } from '../data/challengesData';
import FadeIn from '../../../components/FadeIn';

const COLUMNS = 8;
const generateEmptyRow = () => Array(COLUMNS).fill(null);

const ChallengeWorkbench = ({
  challenge,
  isCompleted,
  onBack,
  onNavigateChallenge,
  onProgressUpdated
}) => {
  const {
    id,
    code,
    title,
    subtitle,
    difficulty,
    difficultyColor,
    numQubits,
    defaultShots,
    objective,
    hint,
    successCriteria,
    requiredSolution
  } = challenge;

  // Circuit Grid state (configured for challenge.numQubits)
  const [grid, setGrid] = useState(() => {
    return Array.from({ length: numQubits }, () => generateEmptyRow());
  });

  const [selectedGate, setSelectedGate] = useState(null);
  const [pendingCX, setPendingCX] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Execution states
  const [isSimulating, setIsSimulating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [executionError, setExecutionError] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const clearSimulationState = useCallback(() => {
    setSimulationResult(null);
    setExecutionError(null);
    setEvaluationResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setGrid(Array.from({ length: numQubits }, () => generateEmptyRow()));
    setSelectedGate(null);
    setPendingCX(null);
    clearSimulationState();
  }, [numQubits, clearSimulationState]);

  const handleSelectGate = useCallback((gate) => {
    setSelectedGate(gate);
    setPendingCX(null);
  }, []);

  const handleCellClick = useCallback((rIdx, cIdx) => {
    clearSimulationState();

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => [...row]);
      const existingCell = newGrid[rIdx][cIdx];

      // Handle CX target placement
      if (pendingCX) {
        if (pendingCX.column !== cIdx) return prevGrid;
        if (pendingCX.control === rIdx) return prevGrid;
        if (existingCell) return prevGrid;

        newGrid[pendingCX.control][cIdx] = { type: 'CX-C', target: rIdx };
        newGrid[rIdx][cIdx] = { type: 'CX-T', control: pendingCX.control };
        setPendingCX(null);
        return newGrid;
      }

      // Empty gate clearing
      if (!selectedGate) {
        if (existingCell && existingCell.type !== 'CX-C' && existingCell.type !== 'CX-T') {
          newGrid[rIdx][cIdx] = null;
        } else if (existingCell && (existingCell.type === 'CX-C' || existingCell.type === 'CX-T')) {
          const pairRow = existingCell.type === 'CX-C' ? existingCell.target : existingCell.control;
          newGrid[rIdx][cIdx] = null;
          if (newGrid[pairRow]) {
            newGrid[pairRow][cIdx] = null;
          }
        }
        return newGrid;
      }

      // Initiate CX placement (only valid if numQubits >= 2)
      if (selectedGate === 'CX') {
        if (numQubits < 2) return prevGrid;
        if (existingCell) return prevGrid;
        setPendingCX({ control: rIdx, column: cIdx });
        return prevGrid;
      }

      // Standard gate placement
      if (existingCell && (existingCell.type === 'CX-C' || existingCell.type === 'CX-T')) {
        return prevGrid;
      }

      newGrid[rIdx][cIdx] = { type: selectedGate };
      return newGrid;
    });
  }, [selectedGate, pendingCX, numQubits, clearSimulationState]);

  // Run pure simulation (exploratory)
  const handleRunSimulation = async () => {
    if (isSimulating || isEvaluating) return;

    try {
      setIsSimulating(true);
      setExecutionError(null);
      setSimulationResult(null);

      const circuitDef = gridToCircuitDefinition(grid, numQubits, defaultShots);
      const result = await simulateCircuit(circuitDef);

      setSimulationResult(result);
    } catch (err) {
      console.error('Challenge simulation error:', err);
      const msg = err?.message || 'Simulation execution failed. Please verify the backend service is active.';
      setExecutionError(msg);
    } finally {
      setIsSimulating(false);
    }
  };

  // Check Solution against Challenge Objectives
  const handleCheckSolution = async () => {
    if (isSimulating || isEvaluating) return;

    try {
      setIsEvaluating(true);
      setExecutionError(null);
      setEvaluationResult(null);

      const circuitDef = gridToCircuitDefinition(grid, numQubits, defaultShots);
      const result = await simulateCircuit(circuitDef);

      setSimulationResult(result);

      // Evaluate the quantum correctness
      const evaluation = evaluateChallengeSolution({
        challengeId: id,
        circuitDef,
        simulationResult: result
      });

      setEvaluationResult(evaluation);

      // Persist progress if successfully solved
      if (evaluation.success) {
        markChallengeCompleted(id, {
          fidelity: evaluation.fidelity,
          concurrence: evaluation.concurrence || 0
        });
        if (onProgressUpdated) {
          onProgressUpdated();
        }
      }
    } catch (err) {
      console.error('Challenge validation error:', err);
      const msg = err?.message || 'Verification could not be completed. Backend simulation error.';
      setExecutionError(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetChallengeProgress = () => {
    resetChallengeCompletion(id);
    setEvaluationResult(null);
    if (onProgressUpdated) {
      onProgressUpdated();
    }
  };

  // Find adjacent challenges for quick navigation
  const currentIndex = CHALLENGES.findIndex(c => c.id === id);
  const prevChallenge = currentIndex > 0 ? CHALLENGES[currentIndex - 1] : null;
  const nextChallenge = currentIndex < CHALLENGES.length - 1 ? CHALLENGES[currentIndex + 1] : null;

  const isBusy = isSimulating || isEvaluating;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Navigation & Header */}
      <FadeIn direction="down" distance="15px">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--border-light)',
                color: 'var(--text-secondary)',
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-blue)';
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              ← ALL CHALLENGES
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {prevChallenge && (
                <button
                  onClick={() => onNavigateChallenge(prevChallenge.id)}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-dim)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem'
                  }}
                  title={prevChallenge.title}
                >
                  ← PREV: CH-{prevChallenge.numStr}
                </button>
              )}
              {nextChallenge && (
                <button
                  onClick={() => onNavigateChallenge(nextChallenge.id)}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-dim)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem'
                  }}
                  title={nextChallenge.title}
                >
                  NEXT: CH-{nextChallenge.numStr} →
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <span className="tech-label text-blue">{code}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '2px',
                    border: `1px solid ${difficultyColor}`,
                    color: difficultyColor
                  }}
                >
                  {difficulty.toUpperCase()}
                </span>
                {isCompleted && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '2px',
                      border: '1px solid var(--accent-green)',
                      color: 'var(--accent-green)',
                      backgroundColor: 'rgba(52, 211, 153, 0.1)'
                    }}
                  >
                    ✓ CALIBRATION VERIFIED
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h1>
              <div style={{ color: 'var(--text-dim)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
                {subtitle}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/lab">
                <button
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-secondary)',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.85rem'
                  }}
                  title="Open full interactive quantum lab in a new view"
                >
                  OPEN FULL LAB ↗
                </button>
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Challenge Briefing Panel */}
      <div className="sci-panel" style={{ padding: '2rem', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
              CHALLENGE OBJECTIVE
            </div>
            <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
              {objective}
            </p>
          </div>

          <div>
            <div className="tech-label" style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>
              SUCCESS VERIFICATION CRITERIA
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.8rem 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {successCriteria}
            </p>
            <div className="text-mono" style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Target: <span style={{ color: 'var(--accent-blue)' }}>{requiredSolution}</span>
            </div>
          </div>
        </div>

        {/* Conceptual Hint Drawer */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setShowHint(prev => !prev)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                padding: '0.2rem 0',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-blue)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
            >
              <span>{showHint ? '▼' : '►'}</span>
              <span>{showHint ? 'HIDE CONCEPTUAL HINT' : 'VIEW CONCEPTUAL HINT'}</span>
            </button>
            <div className="text-mono text-dim" style={{ fontSize: '0.8rem' }}>
              Qubits: {numQubits} • Shots: {defaultShots}
            </div>
          </div>

          {showHint && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1.2rem',
                backgroundColor: 'var(--bg-panel-light)',
                borderLeft: '3px solid var(--accent-blue)',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}
            >
              <div className="tech-label text-blue" style={{ marginBottom: '0.4rem' }}>QUANTUM MECHANICS HINT</div>
              {hint}
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Circuit Editor Area */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Gate Palette & Actions */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div className="tech-label" style={{ marginBottom: '0.75rem', color: 'var(--text-dim)', paddingLeft: '0.2rem' }}>
              AVAILABLE QUANTUM GATES
            </div>
            <GatePalette
              selectedGate={selectedGate}
              onSelectGate={handleSelectGate}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={handleCheckSolution}
              disabled={isBusy}
              style={{
                fontSize: '1.05rem',
                padding: '1.1rem',
                backgroundColor: isEvaluating ? 'var(--bg-panel-light)' : 'var(--accent-blue)',
                color: 'var(--bg-dark)',
                border: '1px solid var(--accent-blue)',
                fontWeight: 'bold',
                cursor: isBusy ? 'not-allowed' : 'pointer',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                if (!isBusy) {
                  e.currentTarget.style.backgroundColor = '#7dd3fc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isBusy) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-blue)';
                }
              }}
            >
              {isEvaluating ? 'EVALUATING CIRCUIT...' : 'CHECK SOLUTION ✓'}
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isBusy}
              style={{
                fontSize: '0.95rem',
                padding: '0.9rem',
                backgroundColor: 'var(--bg-panel)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                fontWeight: 600,
                cursor: isBusy ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!isBusy) {
                  e.currentTarget.style.borderColor = 'var(--accent-blue)';
                  e.currentTarget.style.color = 'var(--accent-blue)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isBusy) {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
            >
              {isSimulating ? 'SIMULATING...' : 'RUN SIMULATION ONLY'}
            </button>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={handleClear}
                disabled={isBusy}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-dim)',
                  padding: '0.6rem',
                  fontSize: '0.85rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
              >
                CLEAR GRID
              </button>

              {isCompleted && (
                <button
                  onClick={handleResetChallengeProgress}
                  disabled={isBusy}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-dim)',
                    padding: '0.6rem',
                    fontSize: '0.85rem'
                  }}
                  title="Reset completion status to verify again"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                  RETRY
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Circuit Board & Feedback */}
        <div style={{ flex: '2 1 650px', display: 'flex', flexDirection: 'column', gap: '2.5rem', minWidth: 0 }}>
          
          {/* Circuit Grid Card */}
          <div className="sci-panel" style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--bg-dark)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="tech-label" style={{ color: 'var(--text-dim)' }}>
                CIRCUIT BOARD ({numQubits} QUBIT{numQubits > 1 ? 'S' : ''} • {COLUMNS} STEPS)
              </div>
              <div className="text-mono text-dim" style={{ fontSize: '0.8rem' }}>
                SELECT GATE & CLICK WIRE
              </div>
            </div>

            <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
              <CircuitGrid
                grid={grid}
                selectedGate={selectedGate}
                pendingCX={pendingCX}
                onCellClick={handleCellClick}
                isSimulating={isBusy}
              />
            </div>

            {pendingCX && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px dashed var(--accent-blue)',
                  color: 'var(--accent-blue)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                CNOT CONTROL PLACED ON Q{pendingCX.control}. CLICK A TARGET QUBIT IN COLUMN {pendingCX.column} TO COMPLETE THE TWO-QUBIT GATE.
              </div>
            )}
          </div>

          {/* Execution Error Banner */}
          {executionError && (
            <div className="sci-panel" style={{ borderColor: 'var(--accent-red)', padding: '1.5rem' }}>
              <div className="tech-label text-red" style={{ marginBottom: '0.5rem' }}>SIMULATION FAULT</div>
              <p className="text-white" style={{ margin: 0, fontSize: '1.05rem', wordBreak: 'break-word' }}>
                {executionError}
              </p>
              <p style={{ marginTop: '0.8rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                Verify your operations and ensure the Ketrix FastAPI backend service is running on port 8000.
              </p>
            </div>
          )}

          {/* Solution Evaluation Feedback Banner */}
          {evaluationResult && (
            <FadeIn direction="up" distance="15px">
              <div
                className="sci-panel"
                style={{
                  padding: '2rem',
                  borderColor: evaluationResult.success ? 'var(--accent-green)' : 'var(--accent-amber)',
                  backgroundColor: evaluationResult.success ? 'rgba(52, 211, 153, 0.05)' : 'rgba(251, 146, 60, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    className="tech-label"
                    style={{
                      color: evaluationResult.success ? 'var(--accent-green)' : 'var(--accent-amber)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.15em'
                    }}
                  >
                    {evaluationResult.success ? 'VERIFICATION SUCCESS // CHALLENGE PASSED' : 'VERIFICATION INCOMPLETE // RECALIBRATION REQUIRED'}
                  </div>

                  {evaluationResult.success && nextChallenge && (
                    <button
                      onClick={() => onNavigateChallenge(nextChallenge.id)}
                      style={{
                        backgroundColor: 'var(--accent-green)',
                        color: 'var(--bg-dark)',
                        borderColor: 'var(--accent-green)',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}
                    >
                      PROCEED TO NEXT CHALLENGE →
                    </button>
                  )}
                </div>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
                  {evaluationResult.summaryTitle}
                </h3>

                {/* Details List */}
                {evaluationResult.details && evaluationResult.details.length > 0 && (
                  <ul style={{ margin: '0 0 1.2rem 0', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                    {evaluationResult.details.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.3rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Error Diagnosis if Failed */}
                {evaluationResult.errorDiagnosis && (
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderLeft: '3px solid var(--accent-amber)',
                      marginBottom: '1.2rem',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <strong>Diagnosis:</strong> {evaluationResult.errorDiagnosis}
                  </div>
                )}

                {/* Quantum Concept Explanation */}
                {evaluationResult.quantumConcept && (
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Quantum Concept: </strong>
                    {evaluationResult.quantumConcept}
                  </div>
                )}
              </div>
            </FadeIn>
          )}

          {/* Simulation Output Visualizations */}
          {simulationResult && (
            <FadeIn direction="up" distance="20px">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div className="tech-label" style={{ color: 'var(--accent-blue)', letterSpacing: '0.15em' }}>
                  SIMULATION TELEMETRY & QUANTUM STATE READOUT
                </div>

                <SimulationResults result={simulationResult} />

                {simulationResult.statevector ? (
                  <CoreStateVisualizer
                    title="Pre-Measurement Statevector Analysis"
                    desc="Complex probability amplitudes of the pure state prior to projection."
                    statevector={simulationResult.statevector}
                  />
                ) : (
                  <div className="sci-panel" style={{ padding: '2rem', color: 'var(--text-dim)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    [STATEVECTOR UNAVAILABLE]
                  </div>
                )}

                {simulationResult.statevector && numQubits === 1 && (
                  <BlochSphere
                    title="Bloch Sphere State Representation"
                    description="Geometric state orientation on the unit sphere."
                    statevector={simulationResult.statevector}
                  />
                )}
              </div>
            </FadeIn>
          )}

          {!simulationResult && !executionError && !evaluationResult && (
            <div
              className="sci-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4rem 2rem',
                borderStyle: 'dashed'
              }}
            >
              <div className="tech-label" style={{ marginBottom: '0.8rem', color: 'var(--text-dim)' }}>
                CIRCUIT AWAITING SIMULATION
              </div>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 0, fontSize: '1rem', maxWidth: '450px' }}>
                Select quantum gates from the palette, place them on the wire, then click <strong>"Check Solution"</strong> to verify your state preparation circuit against the challenge objective.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChallengeWorkbench;
