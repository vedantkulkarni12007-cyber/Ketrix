
const ConceptPanel = ({ leftTitle, leftContent, leftCode, rightTitle, rightContent, rightCode }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        {leftTitle && <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{leftTitle}</h3>}
        <p>{leftContent}</p>
        {leftCode && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-dark)', fontFamily: 'var(--font-mono)' }}>
            {leftCode}
          </div>
        )}
      </div>
      <div>
        {rightTitle && <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{rightTitle}</h3>}
        <p>{rightContent}</p>
        {rightCode && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-dark)', fontFamily: 'var(--font-mono)' }}>
            {rightCode}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptPanel;
