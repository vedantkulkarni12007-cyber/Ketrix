import { useParams, Link } from 'react-router-dom';
import QubitLesson from '../features/lessons/what-is-a-qubit/QubitLesson';
import ClassicalVsQuantumLesson from '../features/lessons/classical-vs-quantum/ClassicalVsQuantumLesson';
import SuperpositionLesson from '../features/lessons/superposition/SuperpositionLesson';
import MeasurementLesson from '../features/lessons/measurement/MeasurementLesson';
import XGateLesson from '../features/lessons/x-gate/XGateLesson';
import YGateLesson from '../features/lessons/y-gate/YGateLesson';
import ZGateLesson from '../features/lessons/z-gate/ZGateLesson';
import HadamardGateLesson from '../features/lessons/hadamard-gate/HadamardGateLesson';
import CNOTGateLesson from '../features/lessons/cnot-gate/CNOTGateLesson';
import MultipleQubitsLesson from '../features/lessons/multiple-qubits/MultipleQubitsLesson';
import EntanglementLesson from '../features/lessons/entanglement/EntanglementLesson';
import BellStatesLesson from '../features/lessons/bell-states/BellStatesLesson';
import DeutschJozsaLesson from '../features/lessons/deutsch-jozsa/DeutschJozsaLesson';
import GroversLesson from '../features/lessons/grovers/GroversLesson';
import TeleportationLesson from '../features/lessons/teleportation/TeleportationLesson';

const LessonDetail = () => {
  const { lessonId } = useParams();

  if (lessonId === 'classical-vs-quantum') {
    return <ClassicalVsQuantumLesson />;
  }
  
  if (lessonId === 'what-is-a-qubit') {
    return <QubitLesson />;
  }

  if (lessonId === 'superposition') return <SuperpositionLesson />;
  if (lessonId === 'measurement') return <MeasurementLesson />;
  if (lessonId === 'x-gate') return <XGateLesson />;
  if (lessonId === 'y-gate') return <YGateLesson />;
  if (lessonId === 'z-gate') return <ZGateLesson />;
  if (lessonId === 'hadamard-gate') return <HadamardGateLesson />;
  if (lessonId === 'cnot-gate') return <CNOTGateLesson />;
  if (lessonId === 'multiple-qubits') return <MultipleQubitsLesson />;
  if (lessonId === 'entanglement') return <EntanglementLesson />;
  if (lessonId === 'bell-states') return <BellStatesLesson />;
  if (lessonId === 'deutsch-jozsa') return <DeutschJozsaLesson />;
  if (lessonId === 'grovers') return <GroversLesson />;
  if (lessonId === 'teleportation') return <TeleportationLesson />;

  return (
    <div className="container" style={{ maxWidth: '1000px', paddingBottom: '6rem' }}>
      <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <span>&larr;</span> BACK TO CURRICULUM
      </Link>
      
      <div className="sci-panel" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div className="tech-label text-amber" style={{ marginBottom: '1rem' }}>SYSTEM WARNING</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{lessonId.replace(/-/g, ' ')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          This experimental module is currently offline. Calibration is in progress.
        </p>
        <div className="text-mono text-dim" style={{ fontSize: '0.9rem' }}>
          ETA: UNKNOWN // RETURN TO BASE MODULES
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
