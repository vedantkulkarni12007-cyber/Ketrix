const CircuitGrid = ({ grid, selectedGate, pendingCX, onCellClick }) => {
  const numCols = grid[0]?.length || 0;

  return (
    <div className="sci-panel" style={{ padding: '2rem', overflowX: 'auto', marginBottom: '2rem' }}>
      <div className="tech-label text-amber" style={{ marginBottom: '1.5rem' }}>CIRCUIT BOARD</div>
      
      {pendingCX && (
        <div className="tech-label text-amber" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent-amber)', padding: '0.5rem', display: 'inline-block', backgroundColor: 'rgba(251, 146, 60, 0.1)' }}>
          CX CONTROL SELECTED — CHOOSE TARGET
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
        
        {/* Timeline Header */}
        <div style={{ display: 'flex', marginLeft: '60px' }}>
          {Array.from({ length: numCols }).map((_, col) => (
            <div key={`col-${col}`} className="tech-label" style={{ width: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
              T{col}
            </div>
          ))}
        </div>

        {/* Qubit Wires */}
        {grid.map((row, rIdx) => (
          <div key={`row-${rIdx}`} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Row Label */}
            <div className="tech-label text-blue" style={{ width: '60px', fontWeight: 'bold' }}>
              q{rIdx}
            </div>

            {/* The physical wire running behind the cells */}
            <div style={{
              position: 'absolute',
              left: '60px',
              right: 0,
              height: '2px',
              backgroundColor: 'var(--border-light)',
              zIndex: 0
            }} />

            {/* Cells */}
            <div style={{ display: 'flex' }}>
              {row.map((cell, cIdx) => {
                
                // Determine if we need to draw a vertical line for CX
                const hasVerticalLine = cell && cell.type === 'CX-C';
                // Find how far to draw the line down/up
                let cxTargetDelta = 0;
                if (hasVerticalLine) {
                  cxTargetDelta = cell.target - rIdx;
                }

                // If this is the pending CX control cell, pulse it visually
                const isPending = pendingCX && pendingCX.control === rIdx && pendingCX.column === cIdx;

                return (
                  <div 
                    key={`cell-${rIdx}-${cIdx}`}
                    onClick={() => onCellClick(rIdx, cIdx)}
                    style={{
                      position: 'relative',
                      width: '60px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: hasVerticalLine ? 10 : 1,
                      cursor: selectedGate || cell ? 'pointer' : 'default'
                    }}
                  >
                    {/* Vertical connector for CX */}
                    {hasVerticalLine && (
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: cxTargetDelta > 0 ? '50%' : `calc(50% - ${Math.abs(cxTargetDelta) * 72}px)`,
                        width: '2px',
                        height: `${Math.abs(cxTargetDelta) * 72}px`, // 72px is 40px height + 2rem gap (32px)
                        backgroundColor: 'var(--accent-blue)',
                        zIndex: -1,
                        transform: 'translateX(-50%)'
                      }} />
                    )}

                    {/* Cell Content */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: cell ? 'var(--bg-dark)' : 'transparent',
                      border: `1px solid ${isPending ? 'var(--accent-amber)' : (cell ? 'var(--accent-blue)' : 'transparent')}`,
                      borderRadius: cell && (cell.type === 'CX-C' || cell.type === 'CX-T') ? '50%' : '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      color: isPending ? 'var(--accent-amber)' : 'var(--accent-blue)',
                      transition: 'all 0.2s',
                      boxShadow: isPending ? '0 0 10px rgba(251, 146, 60, 0.3)' : 'none'
                    }}>
                      {cell && cell.type === 'CX-C' ? '●' : null}
                      {cell && cell.type === 'CX-T' ? 'X' : null}
                      {cell && cell.type !== 'CX-C' && cell.type !== 'CX-T' ? cell.type : null}
                      {!cell && <span style={{ color: 'var(--border-light)' }}>·</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitGrid;
