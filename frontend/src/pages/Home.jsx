import { useState } from 'react';
import { Link } from 'react-router-dom';
import BlochSphere from '../features/visualization/BlochSphere';

const Home = () => {
  // Single-qubit state explorer logic for the Home page demo
  const [demoState, setDemoState] = useState([
    { real: 1, imag: 0 },
    { real: 0, imag: 0 }
  ]);

  const applyGate = (gate) => {
    setDemoState(prev => {
      const v0 = prev[0];
      const v1 = prev[1];
      const INV_SQRT2 = 1 / Math.sqrt(2);
      
      switch (gate) {
        case '0':
          return [{ real: 1, imag: 0 }, { real: 0, imag: 0 }];
        case '1':
          return [{ real: 0, imag: 0 }, { real: 1, imag: 0 }];
        case 'X':
          return [v1, v0];
        case 'Z':
          return [v0, { real: -v1.real, imag: -v1.imag }];
        case 'H':
          return [
            { 
              real: (v0.real + v1.real) * INV_SQRT2, 
              imag: (v0.imag + v1.imag) * INV_SQRT2 
            },
            { 
              real: (v0.real - v1.real) * INV_SQRT2, 
              imag: (v0.imag - v1.imag) * INV_SQRT2 
            }
          ];
        default:
          return prev;
      }
    });
  };

  const calculateProbabilities = () => {
    const p0 = demoState[0].real ** 2 + demoState[0].imag ** 2;
    const p1 = demoState[1].real ** 2 + demoState[1].imag ** 2;
    return {
      p0: (p0 * 100).toFixed(1),
      p1: (p1 * 100).toFixed(1)
    };
  };

  const probs = calculateProbabilities();

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
          <div className="tech-label" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
            QUANTUM COMPUTING PLATFORM
          </div>
          <h1 style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: 'clamp(3.5rem, 5vw, 4.5rem)',
            lineHeight: '1.05',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            Think Beyond <br/>
            <span style={{ color: 'var(--accent-blue)' }}>Classical.</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            maxWidth: '550px', 
            marginBottom: '3rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Learn quantum concepts, build circuits in a full-featured laboratory, run them on a real Qiskit simulation backend, and explore complex quantum algorithms.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/learn">
              <button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)', borderColor: 'var(--accent-blue)', padding: '1rem 2rem', fontSize: '1rem' }}>
                ENTER CURRICULUM
              </button>
            </Link>
            <Link to="/lab">
              <button style={{ padding: '1rem 2rem', fontSize: '1rem', backgroundColor: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border-active)' }}>
                OPEN LABORATORY
              </button>
            </Link>
            <Link to="/simulator">
              <button style={{ padding: '1rem 2rem', fontSize: '1rem', backgroundColor: 'transparent', color: 'var(--text-primary)', border: 'none', textDecoration: 'underline' }}>
                Simulator Config
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Quantum Explorer */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="sci-panel" style={{ padding: '0' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="tech-label text-blue">LIVE STATE EXPLORER</div>
              <div className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>LOCAL MATH ENGINE</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-panel-light)' }}>
              <BlochSphere statevector={demoState} />
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div className="tech-label" style={{ marginBottom: '0.5rem', color: 'var(--text-dim)' }}>PROB(0)</div>
                <div className="text-mono text-white">{probs.p0}%</div>
                <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-light)', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${probs.p0}%`, backgroundColor: 'var(--accent-blue)', transition: 'width 0.3s' }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="tech-label" style={{ marginBottom: '0.5rem', color: 'var(--text-dim)' }}>PROB(1)</div>
                <div className="text-mono text-white">{probs.p1}%</div>
                <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-light)', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${probs.p1}%`, backgroundColor: 'var(--accent-amber)', transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => applyGate('0')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>|0⟩</button>
            <button onClick={() => applyGate('1')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>|1⟩</button>
            <button onClick={() => applyGate('X')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>X</button>
            <button onClick={() => applyGate('Z')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>Z</button>
            <button onClick={() => applyGate('H')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>H</button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      
      {/* 1. Explore the Quantum World */}
      <section style={{ padding: '6rem 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>MODULE 01</div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Explore the Quantum World.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="sci-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Superposition</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Observe how quantum systems exist in multiple states simultaneously until measured, forming the basis of quantum parallelism.</p>
          </div>
          <div className="sci-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Entanglement</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Create Bell states and observe non-local correlations that defy classical probability and form the backbone of teleportation.</p>
          </div>
          <div className="sci-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Interference</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Utilize constructive and destructive wave interference to amplify correct answers and cancel out incorrect ones.</p>
          </div>
          <div className="sci-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Measurement</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Understand the probabilistic collapse of statevectors into classical bits through rigorous simulation runs.</p>
          </div>
        </div>
      </section>

      {/* 2. Build and Experiment */}
      <section style={{ padding: '6rem 0', borderTop: '1px solid var(--border-light)', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>MODULE 02</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Build and Experiment.</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
            Ketrix includes a fully unrestricted Quantum Laboratory. Compose complex multi-qubit circuits using a visual grid editor. 
            Dispatch your circuits to the Qiskit Aer backend and instantly analyze statevectors, measurement histograms, and classical conditional logic.
          </p>
          <Link to="/lab">
            <button style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>ENTER THE LAB &rarr;</button>
          </Link>
        </div>
        <div className="sci-panel" style={{ flex: '1 1 400px', padding: '2rem', backgroundColor: 'var(--bg-panel-light)' }}>
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div className="tech-label" style={{ width: '40px' }}>q0</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', width: '20px' }} />
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>H</div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', width: '20px' }} />
              <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-blue)', borderRadius: '50%' }} />
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', flex: 1 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="tech-label" style={{ width: '40px' }}>q1</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', width: '72px' }} />
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--accent-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>X</div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', flex: 1 }} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--accent-blue)', position: 'relative', left: '104px', top: '-46px' }} />
        </div>
      </section>

      {/* 3. Algorithms & Curriculum */}
      <section style={{ padding: '6rem 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>MODULE 03</div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Explore Quantum Algorithms.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="sci-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>LESSON 13</div>
            <h3 style={{ marginBottom: '1rem' }}>Deutsch-Jozsa</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
              Determine if an oracle function is constant or balanced in a single quantum evaluation, proving deterministic quantum advantage.
            </p>
            <Link to="/learn/deutsch-jozsa" style={{ marginTop: '2rem' }}>
              <button style={{ width: '100%' }}>STUDY ALGORITHM</button>
            </Link>
          </div>

          <div className="sci-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>LESSON 14</div>
            <h3 style={{ marginBottom: '1rem' }}>Grover's Search</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
              Use amplitude amplification to invert and magnify the probability of finding a marked item in an unstructured search space.
            </p>
            <Link to="/learn/grovers" style={{ marginTop: '2rem' }}>
              <button style={{ width: '100%' }}>STUDY ALGORITHM</button>
            </Link>
          </div>

          <div className="sci-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>LESSON 15</div>
            <h3 style={{ marginBottom: '1rem' }}>Teleportation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
              Transfer an unknown quantum state across space using a classical communication channel and a pre-shared EPR pair.
            </p>
            <Link to="/learn/teleportation" style={{ marginTop: '2rem' }}>
              <button style={{ width: '100%' }}>STUDY ALGORITHM</button>
            </Link>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '6rem 0 2rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Ready to initialize?</h2>
        <Link to="/learn">
          <button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)', padding: '1.5rem 3rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            START THE CURRICULUM
          </button>
        </Link>
      </section>

    </div>
  );
};

export default Home;
