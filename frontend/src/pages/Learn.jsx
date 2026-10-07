import { Link } from 'react-router-dom';
import { curriculumData } from '../data/curriculum';

const Learn = () => {
  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>SYSTEM CURRICULUM</div>
        <h1 style={{ fontSize: '3rem', textTransform: 'uppercase' }}>Quantum Journey</h1>
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>
          Follow the operational pathway from basic computational states to complex multi-qubit algorithms.
        </p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Main vertical trunk wire */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          bottom: 0, 
          left: '7px', 
          width: '2px', 
          backgroundColor: 'var(--border-light)' 
        }} />

        {curriculumData.map((module, mIdx) => (
          <div key={module.category} style={{ marginBottom: '4rem', position: 'relative' }}>
            
            {/* Module Node on wire */}
            <div style={{
              position: 'absolute',
              left: '-2rem', // to center over the wire, 2rem = 32px. Wire is at left:7px relative to parent. 
              // Wait, parent padding is 2rem (32px). The wire is at left: 7px.
              // So if node is position relative inside module, left: -2rem brings it to left edge.
              // left: -30px will place it nicely on the wire.
            }}>
               <div style={{
                 position: 'absolute',
                 left: '-29px',
                 top: '5px',
                 width: '12px',
                 height: '12px',
                 backgroundColor: 'var(--bg-dark)',
                 border: '2px solid var(--accent-blue)',
                 borderRadius: '50%',
                 zIndex: 2
               }} />
            </div>

            <div className="tech-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              STAGE {String(mIdx + 1).padStart(2, '0')}
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{module.category}</h2>
            <p style={{ marginBottom: '2rem' }}>{module.description || 'Master the fundamental theories and operations of quantum mechanics.'}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {module.lessons.map((lesson) => {
                const globalIndex = lesson.expId; // Use the explicit experiment number from curriculum data

                return (
                  <Link 
                    key={lesson.id} 
                    to={`/learn/${lesson.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="sci-panel" style={{ 
                      padding: '1.5rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2rem',
                      transition: 'transform 0.2s',
                      transform: 'translateX(0)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.borderColor = 'var(--accent-blue)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                    >
                      {/* Sub-wire horizontal connection */}
                      <div style={{
                        position: 'absolute',
                        left: '-2rem',
                        top: '50%',
                        width: '2rem',
                        height: '2px',
                        backgroundColor: 'var(--border-light)',
                        zIndex: 0
                      }} />

                      <div className="tech-label" style={{ 
                        color: 'var(--accent-blue)', 
                        minWidth: '60px' 
                      }}>
                        EXP-{String(globalIndex).padStart(2, '0')}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                          {lesson.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {lesson.description}
                        </p>
                      </div>

                      <div style={{ 
                        padding: '0.25rem 0.75rem', 
                        backgroundColor: 'var(--bg-dark)', 
                        border: '1px solid var(--border-light)',
                        borderRadius: '2px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        color: lesson.difficulty === 'Beginner' ? 'var(--accent-green)' : 'var(--accent-amber)'
                      }}>
                        {lesson.difficulty}
                      </div>

                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
