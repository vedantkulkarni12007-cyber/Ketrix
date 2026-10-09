import { useParams, Link } from 'react-router-dom';
import SuperpositionExplorer from '../features/simulator/SuperpositionExplorer';
import GateExplorer from '../features/simulator/GateExplorer';
import MeasurementLab from '../features/simulator/MeasurementLab';
import QuantumInterference from '../features/simulator/QuantumInterference';
import EntanglementStudio from '../features/simulator/EntanglementStudio';
import AlgorithmPlayground from '../features/simulator/AlgorithmPlayground';

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
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem', letterSpacing: '0.2em' }}>INTERACTIVE EXPERIMENTS</div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>Quantum Simulations Playground</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', marginTop: '1.5rem' }}>
          Select an interactive simulation to explore quantum concepts hands-on. Each playground provides real Qiskit execution, live state visualizations, and guided interpretations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {experiments.map((exp) => (
          <Link key={exp.id} to={`/simulator/${exp.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sci-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer' }}
                 onMouseOver={(e) => {
                   e.currentTarget.style.borderColor = 'var(--accent-blue)';
                   e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.1)';
                 }}
                 onMouseOut={(e) => {
                   e.currentTarget.style.borderColor = 'var(--border-light)';
                   e.currentTarget.style.boxShadow = 'none';
                 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span className="tech-label text-blue">{exp.category}</span>
                <span className={`tech-label ${exp.diff === 'Beginner' ? 'text-green' : exp.diff === 'Intermediate' ? 'text-amber' : 'text-red'}`}>
                  {exp.diff}
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{exp.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1 }}>{exp.desc}</p>
              
              <div style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                INITIALIZE EXPERIMENT <span>&rarr;</span>
              </div>
            </div>
          </Link>
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
    <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
      <div className="tech-label text-red">ERROR</div>
      <h1>EXPERIMENT NOT FOUND</h1>
      <Link to="/simulator" className="tech-label text-blue" style={{ marginTop: '2rem', display: 'inline-block' }}>&larr; RETURN TO PLAYGROUND</Link>
    </div>
  );
};

export default Simulator;
