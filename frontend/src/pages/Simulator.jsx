import { useParams, Link } from 'react-router-dom';
import SuperpositionExplorer from '../features/simulator/SuperpositionExplorer';
import GateExplorer from '../features/simulator/GateExplorer';
import MeasurementLab from '../features/simulator/MeasurementLab';
import QuantumInterference from '../features/simulator/QuantumInterference';
import EntanglementStudio from '../features/simulator/EntanglementStudio';
import AlgorithmPlayground from '../features/simulator/AlgorithmPlayground';
import FadeIn from '../components/FadeIn';

const experiments = [
  { id: 'superposition', title: 'Superposition Explorer', desc: 'Observe a qubit enter multiple states at once using the Hadamard gate.', category: 'Fundamentals', diff: 'Beginner' },
  { id: 'gates', title: 'Quantum Gate Explorer', desc: 'Apply single-qubit rotations and visualize phase changes on the Bloch sphere.', category: 'Fundamentals', diff: 'Beginner' },
  { id: 'measurement', title: 'Measurement Lab', desc: 'Run repeated quantum shots to observe statistical probability distributions in action.', category: 'Measurement & Stats', diff: 'Intermediate' },
  { id: 'interference', title: 'Quantum Interference', desc: 'See how quantum probability amplitudes can destructively and constructively interfere.', category: 'Measurement & Stats', diff: 'Intermediate' },
  { id: 'entanglement', title: 'Entanglement Studio', desc: 'Create Bell states and observe how multiple qubits share correlated outcomes.', category: 'Multi-Qubit Systems', diff: 'Advanced' },
  { id: 'algorithms', title: 'Algorithm Playground', desc: 'Run real quantum protocols like Deutsch-Jozsa, Grover Search and Teleportation.', category: 'Quantum Algorithms', diff: 'Advanced' }
];

const SimulatorCatalogue = () => {
  return (
    <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1200px' }}>
      <FadeIn direction="down" distance="30px">
        <div style={{ marginBottom: '4rem' }}>
          <div className="tech-label text-blue" style={{ marginBottom: '1rem', letterSpacing: '0.2em' }}>INTERACTIVE EXPERIMENTS</div>
          <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Simulation Playground</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px' }}>
            Select a sandbox environment to explore quantum mechanics dynamically. Each playground provides real Qiskit execution, live state visualizations, and guided interpretations.
          </p>
        </div>
      </FadeIn>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {experiments.map((exp, expIdx) => (
          <FadeIn key={exp.id} delay={expIdx * 0.08} direction="up" distance="25px">
            <Link to={`/simulator/${exp.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
              <div className="sci-panel hover-lift" style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer',
                backgroundColor: 'var(--bg-panel)',
              }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.borderColor = 'var(--accent-blue)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.borderColor = 'var(--border-light)';
                   }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <span className="tech-label text-blue">{exp.category}</span>
                  <span className="tech-label" style={{ 
                    color: exp.diff === 'Beginner' ? 'var(--accent-green)' : exp.diff === 'Intermediate' ? 'var(--accent-amber)' : 'var(--accent-red)',
                    backgroundColor: 'var(--bg-panel-light)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '2px',
                    border: '1px solid var(--border-light)'
                  }}>
                    {exp.diff}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{exp.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1, lineHeight: '1.6' }}>{exp.desc}</p>
                
                <div style={{ 
                  color: 'var(--accent-blue)', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.9rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1.5rem',
                  marginTop: 'auto'
                }}>
                  INITIALIZE MODULE <span>&rarr;</span>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

const Simulator = () => {
  const { experimentId } = useParams();

  if (!experimentId) return <SimulatorCatalogue />;
  
  if (experimentId === 'superposition') return <SuperpositionExplorer />;
  if (experimentId === 'gates') return <GateExplorer />;
  if (experimentId === 'measurement') return <MeasurementLab />;
  if (experimentId === 'interference') return <QuantumInterference />;
  if (experimentId === 'entanglement') return <EntanglementStudio />;
  if (experimentId === 'algorithms') return <AlgorithmPlayground />;
  
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <div className="tech-label text-red" style={{ marginBottom: '1rem' }}>SYSTEM ERROR 404</div>
      <h1 style={{ marginBottom: '2rem' }}>EXPERIMENT NOT FOUND</h1>
      <Link to="/simulator">
        <button style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--bg-dark)', borderColor: 'var(--accent-blue)' }}>
          &larr; RETURN TO PLAYGROUND
        </button>
      </Link>
    </div>
  );
};

export default Simulator;
