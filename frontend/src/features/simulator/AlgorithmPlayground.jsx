import { Link } from 'react-router-dom';
import SimulatorLayout from './SimulatorLayout';

const AlgorithmPlayground = () => {
  const algorithms = [
    {
      id: 'deutsch-jozsa',
      title: 'Deutsch-Jozsa Algorithm',
      desc: 'One of the first examples of exponential quantum advantage. Determine if a function is constant or balanced in a single query.',
      path: '/learn/deutsch-jozsa'
    },
    {
      id: 'grovers-search',
      title: 'Grover\'s Search Algorithm',
      desc: 'Use amplitude amplification to find a marked item in an unstructured database quadratically faster than classical search.',
      path: '/learn/grovers-search'
    },
    {
      id: 'teleportation',
      title: 'Quantum Teleportation',
      desc: 'Transmit a quantum state from one qubit to another using entanglement and classical communication.',
      path: '/learn/teleportation'
    }
  ];

  return (
    <SimulatorLayout 
      title="Quantum Algorithm Playground"
      desc="Access our interactive algorithm environments. Because these protocols require extensive contextual explanation to understand, they are integrated directly into their respective curriculum modules."
    >
      <div className="sci-panel">
        <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>AVAILABLE PROTOCOLS</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {algorithms.map(alg => (
            <div key={alg.id} style={{ 
              padding: '1.5rem', 
              border: '1px solid var(--border-light)', 
              backgroundColor: 'var(--bg-dark)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{alg.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{alg.desc}</p>
              </div>
              <Link 
                to={alg.path} 
                style={{ 
                  alignSelf: 'flex-start',
                  padding: '0.5rem 1.5rem', 
                  backgroundColor: 'var(--accent-blue)', 
                  color: 'var(--bg-dark)', 
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}
              >
                OPEN ALGORITHM ENVIRONMENT &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </SimulatorLayout>
  );
};

export default AlgorithmPlayground;
