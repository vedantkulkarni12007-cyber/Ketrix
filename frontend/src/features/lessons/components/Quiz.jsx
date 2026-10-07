import { useState } from 'react';

const Quiz = ({ questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[currentIdx];

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentIdx((prev) => prev + 1);
  };

  if (currentIdx >= questions.length) {
    return (
      <div className="sci-panel success" style={{ textAlign: 'center' }}>
        <div className="tech-label text-green" style={{ marginBottom: '1rem' }}>ASSESSMENT COMPLETE</div>
        <h3 style={{ marginBottom: '2rem' }}>All parameters within nominal limits.</h3>
        <button 
          onClick={() => { setCurrentIdx(0); setSelectedOption(null); setShowExplanation(false); }}
        >
          REBOOT ASSESSMENT
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-panel-light)' }}>
        <div className="tech-label">QUERY {String(currentIdx + 1).padStart(2, '0')} // {String(questions.length).padStart(2, '0')}</div>
        <div className="tech-label">STATUS: {showExplanation ? 'RESOLVED' : 'AWAITING INPUT'}</div>
      </div>
      
      <div style={{ padding: '2rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '2rem', fontFamily: 'var(--font-sans)' }}>
          {q.question}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {q.options.map((opt, idx) => {
            let borderColor = 'var(--border-light)';
            let textColor = 'var(--text-secondary)';
            let bg = 'transparent';

            if (showExplanation) {
              if (idx === q.correctIdx) {
                borderColor = 'var(--accent-green)';
                textColor = 'var(--accent-green)';
                bg = 'rgba(52, 211, 153, 0.05)';
              } else if (idx === selectedOption) {
                borderColor = 'var(--accent-red)';
                textColor = 'var(--accent-red)';
                bg = 'rgba(248, 113, 113, 0.05)';
              }
            } else if (idx === selectedOption) {
               borderColor = 'var(--accent-blue)';
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  textAlign: 'left',
                  border: `1px solid ${borderColor}`,
                  backgroundColor: bg,
                  color: textColor,
                  padding: '1rem 1.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  textTransform: 'none',
                  letterSpacing: 'normal'
                }}
                disabled={showExplanation}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span className="tech-label" style={{ color: borderColor }}>[{String.fromCharCode(65 + idx)}]</span>
                  <span>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            borderLeft: `2px solid ${selectedOption === q.correctIdx ? 'var(--accent-green)' : 'var(--accent-red)'}`,
            backgroundColor: 'var(--bg-panel)'
          }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)' }}>
              <strong style={{ color: selectedOption === q.correctIdx ? 'var(--accent-green)' : 'var(--accent-red)', marginRight: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                {selectedOption === q.correctIdx ? 'CORRECT // ' : 'INCORRECT // '}
              </strong>
              {q.explanation}
            </p>
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={nextQuestion}>
                PROCEED TO NEXT &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
