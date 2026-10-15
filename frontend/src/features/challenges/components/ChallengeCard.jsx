const ChallengeCard = ({ challenge, isCompleted, completedData, onOpen }) => {
  const { id, code, title, subtitle, difficulty, difficultyColor, objective, requiredSolution } = challenge;

  return (
    <div
      className="sci-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem',
        borderColor: isCompleted ? 'var(--accent-green)' : 'var(--border-light)',
        backgroundColor: 'var(--bg-panel)',
        position: 'relative',
        transition: 'all 0.25s ease',
        cursor: 'pointer'
      }}
      onClick={() => onOpen(id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)';
        e.currentTarget.style.backgroundColor = 'var(--bg-panel-light)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isCompleted ? 'var(--accent-green)' : 'var(--border-light)';
        e.currentTarget.style.backgroundColor = 'var(--bg-panel)';
      }}
    >
      {/* Top Bar: Code and Badges */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div className="tech-label" style={{ color: 'var(--text-dim)', letterSpacing: '0.15em' }}>
            {code}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '2px',
                border: `1px solid ${difficultyColor}`,
                color: difficultyColor,
                backgroundColor: 'rgba(0,0,0,0.2)'
              }}
            >
              {difficulty.toUpperCase()}
            </span>

            {isCompleted ? (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '2px',
                  border: '1px solid var(--accent-green)',
                  color: 'var(--accent-green)',
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>✓</span> COMPLETED
              </span>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '2px',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-dim)',
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}
              >
                READY
              </span>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>
          {title}
        </h2>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.2rem', fontFamily: 'var(--font-mono)' }}>
          {subtitle}
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-light)', marginBottom: '1.2rem' }} />

        {/* Objective */}
        <div style={{ marginBottom: '1rem' }}>
          <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
            OBJECTIVE
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            {objective}
          </p>
        </div>

        {/* Required Approach Preview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="tech-label" style={{ color: 'var(--text-dim)', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
            SOLUTION METHOD
          </div>
          <div className="text-mono" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            {requiredSolution}
          </div>
        </div>
      </div>

      {/* Bottom Footer & Action */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          {isCompleted && completedData?.completedAt ? (
            <span>Verified: {new Date(completedData.completedAt).toLocaleDateString()}</span>
          ) : (
            <span>{challenge.numQubits} Qubit{challenge.numQubits > 1 ? 's' : ''} • Qiskit Aer</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(id);
          }}
          style={{
            borderColor: isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)',
            color: isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)',
            backgroundColor: 'transparent',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)';
            e.currentTarget.style.color = 'var(--bg-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)';
          }}
        >
          {isCompleted ? 'RETRY CHALLENGE ↺' : 'OPEN WORKBENCH →'}
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
