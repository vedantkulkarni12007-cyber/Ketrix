import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Simple state for animation logic
  const [pulsePos, setPulsePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePos(p => (p >= 100 ? 0 : p + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{ 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center',
        flexWrap: 'wrap-reverse',
        gap: '4rem',
        paddingTop: '2rem',
        paddingBottom: '4rem'
      }}>
        
        {/* Left Column: Copy & CTAs */}
        <div style={{ flex: '1 1 500px' }}>
          <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
            QUANTUM COMPUTING PLATFORM
          </div>
          <h1 style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: '4.5rem',
            lineHeight: '1.05',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em'
          }}>
            Think Beyond <br/>
            <span style={{ 
              background: 'linear-gradient(90deg, var(--accent-blue), #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Classical.
            </span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            maxWidth: '550px', 
            marginBottom: '3rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Welcome to Ketrix. Construct quantum circuits, execute them on a real Qiskit Aer backend, and visualize the physics of computation in a professional learning environment.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/learn">
              <button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)', borderColor: 'var(--accent-blue)', padding: '1rem 2rem', fontSize: '1rem' }}>
                ENTER CURRICULUM
              </button>
            </Link>
            <Link to="/simulator">
              <button style={{ padding: '1rem 2rem', fontSize: '1rem', backgroundColor: 'transparent', color: 'var(--text-primary)' }}>
                OPEN SIMULATOR
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Animated Circuit Hero */}
        <div style={{ flex: '1 1 500px', position: 'relative' }}>
          {/* Subtle glow behind the panel */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(11, 12, 16, 0) 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <div className="sci-panel" style={{ 
            padding: '4rem 3rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4rem', 
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(21, 23, 30, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            
            <div className="tech-label" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'var(--text-dim)' }}>
              LIVE SIMULATION // ID: EXP-001
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', marginTop: '2rem' }}>
              <div className="tech-label" style={{ width: '40px', color: 'var(--accent-blue)' }}>q0</div>
              <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--border-light)', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  left: `${pulsePos}%`, 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: 'var(--accent-blue)',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px var(--accent-blue)',
                  opacity: pulsePos < 80 ? 1 : 0
                }} />
                
                <div style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '25%',
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--bg-panel-light)',
                  border: pulsePos > 25 ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  color: pulsePos > 25 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  transition: 'all 0.3s'
                }}>H</div>

                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '60%',
                  width: '10px',
                  height: '10px',
                  backgroundColor: pulsePos > 60 ? 'var(--accent-blue)' : 'var(--border-light)',
                  borderRadius: '50%',
                  transition: 'all 0.3s'
                }}></div>
                {/* Vertical line down to q1 */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '60%',
                  width: '2px',
                  height: '112px', // reaches q1 wire (gap is 4rem = 64px, + 48px sizes)
                  backgroundColor: pulsePos > 60 ? 'var(--accent-blue)' : 'var(--border-light)',
                  transition: 'all 0.3s'
                }}></div>

                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '5%',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-amber)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20M12 12l8-8" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <div className="tech-label" style={{ width: '40px' }}>q1</div>
              <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--border-light)', position: 'relative' }}>
                
                <div style={{
                  position: 'absolute',
                  top: '-24px',
                  left: 'calc(60% - 24px)', // aligned with control dot
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--bg-panel-light)',
                  border: pulsePos > 60 ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  color: pulsePos > 60 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  transition: 'all 0.3s'
                }}>X</div>

                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '5%',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-amber)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20M12 12l8-8" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <div className="tech-label" style={{ color: 'var(--text-dim)' }}>
                BELL STATE |Φ⁺⟩
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <div className="tech-label" style={{ color: 'var(--accent-amber)', fontSize: '0.7rem' }}>M_00</div>
                  <div className="text-mono" style={{ fontSize: '1.1rem', color: pulsePos > 80 ? 'var(--text-primary)' : 'var(--text-dim)' }}>{pulsePos > 80 ? '49.8%' : '---'}</div>
                </div>
                <div>
                  <div className="tech-label" style={{ color: 'var(--accent-amber)', fontSize: '0.7rem' }}>M_11</div>
                  <div className="text-mono" style={{ fontSize: '1.1rem', color: pulsePos > 80 ? 'var(--text-primary)' : 'var(--text-dim)' }}>{pulsePos > 80 ? '50.2%' : '---'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout Features */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '4rem',
        paddingTop: '4rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div className="sci-panel">
          <div className="tech-label" style={{ marginBottom: '1rem' }}>SYS.01</div>
          <h3 style={{ marginBottom: '1rem' }}>Theoretical Foundations</h3>
          <p>Master Dirac notation, quantum states, superposition, and entanglement through step-by-step interactive modules.</p>
        </div>
        
        <div className="sci-panel">
          <div className="tech-label" style={{ marginBottom: '1rem' }}>SYS.02</div>
          <h3 style={{ marginBottom: '1rem' }}>Real Simulation</h3>
          <p>Stop reading text and start measuring. Every lesson is backed by a live connection to the Qiskit Aer simulation engine.</p>
        </div>

        <div className="sci-panel">
          <div className="tech-label" style={{ marginBottom: '1rem' }}>SYS.03</div>
          <h3 style={{ marginBottom: '1rem' }}>Laboratory Challenges</h3>
          <p>Prove your understanding by solving precise state preparation challenges using constrained gate sets.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
