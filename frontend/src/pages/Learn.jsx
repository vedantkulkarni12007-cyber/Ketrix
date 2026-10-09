import { Link } from 'react-router-dom';
import { curriculumData } from '../data/curriculum';

const Learn = () => {
  return (
    <div className="container" style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      
      <div style={{ marginBottom: '4rem' }}>
        <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem', letterSpacing: '0.2em' }}>SYSTEM CURRICULUM</div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Quantum Journey</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', color: 'var(--text-secondary)' }}>
          Follow the operational pathway from basic computational states to complex multi-qubit algorithms. 
          Each module provides interactive experiments executed directly on our Qiskit Aer simulation engine.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
        {/* Main Curriculum Trunk */}
        <div style={{ flex: '1 1 600px', position: 'relative', paddingLeft: '2.5rem' }}>
          {/* Main vertical trunk wire */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            bottom: 0, 
            left: '11px', 
            width: '2px', 
            background: 'linear-gradient(to bottom, var(--accent-blue), var(--border-light) 20%)'
          }} />

          {curriculumData.map((module, mIdx) => (
            <div key={module.category} style={{ marginBottom: '5rem', position: 'relative' }}>
              
              {/* Module Node on wire */}
              <div style={{
                position: 'absolute',
                left: '-2.5rem'
              }}>
                 <div style={{
                   position: 'absolute',
                   left: '5px',
                   top: '6px',
                   width: '14px',
                   height: '14px',
                   backgroundColor: 'var(--bg-dark)',
                   border: '2px solid var(--accent-blue)',
                   borderRadius: '50%',
                   boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
                   zIndex: 2
                 }} />
              </div>

              <div className="tech-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
                STAGE {String(mIdx + 1).padStart(2, '0')}
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{module.category}</h2>
              <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                {module.description || 'Master the fundamental theories and operations of quantum mechanics.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {module.lessons.map((lesson) => {
                  const globalIndex = lesson.expId;

                  return (
                    <Link 
                      key={lesson.id} 
                      to={`/learn/${lesson.id}`}
                      style={{ textDecoration: 'none', position: 'relative', display: 'block' }}
                    >
                      {/* Sub-wire horizontal connection */}
                      <div style={{
                        position: 'absolute',
                        left: '-2.5rem',
                        top: '50%',
                        width: '2.5rem',
                        height: '2px',
                        backgroundColor: 'var(--border-light)',
                        zIndex: 0
                      }} />

                      <div className="sci-panel" style={{ 
                        padding: '1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2rem',
                        transition: 'all 0.2s ease',
                        transform: 'translateX(0)',
                        cursor: 'pointer',
                        backgroundColor: 'var(--bg-dark)'
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.transform = 'translateX(8px)'; 
                        e.currentTarget.style.borderColor = 'var(--accent-blue)'; 
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.05)';
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.transform = 'translateX(0)'; 
                        e.currentTarget.style.borderColor = 'var(--border-light)'; 
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div className="tech-label" style={{ 
                          color: 'var(--accent-blue)', 
                          minWidth: '60px',
                          fontSize: '0.9rem'
                        }}>
                          EXP-{String(globalIndex).padStart(2, '0')}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                            {lesson.title}
                          </h3>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            {lesson.description}
                          </p>
                        </div>

                        <div style={{ 
                          padding: '0.4rem 0.8rem', 
                          backgroundColor: 'var(--bg-panel)', 
                          border: '1px solid var(--border-light)',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: lesson.difficulty === 'Beginner' ? 'var(--accent-green)' : 
                                 lesson.difficulty === 'Intermediate' ? 'var(--accent-amber)' : 'var(--accent-red)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
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

        {/* Sidebar Information Panel */}
        <div style={{ flex: '1 1 350px', position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="sci-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Curriculum Overview
            </h3>
            
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                <span>Total Modules</span>
                <span className="text-mono" style={{ color: 'var(--text-primary)' }}>3 STAGES</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                <span>Total Experiments</span>
                <span className="text-mono" style={{ color: 'var(--text-primary)' }}>15 EXPs</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span>Execution Engine</span>
                <span className="text-mono" style={{ color: 'var(--accent-blue)' }}>QISKIT AER</span>
              </li>
            </ul>
          </div>

          <div className="sci-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Difficulty Index
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-green)', borderRadius: '50%' }}></div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Beginner</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Core concepts & single qubits</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-amber)', borderRadius: '50%' }}></div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Intermediate</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Entanglement & algorithms</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-red)', borderRadius: '50%' }}></div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Advanced</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Complex multi-qubit protocols</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Learn;
