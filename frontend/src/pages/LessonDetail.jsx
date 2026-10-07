import { useParams, Link } from 'react-router-dom';
import QubitLesson from '../features/lessons/what-is-a-qubit/QubitLesson';
import ClassicalVsQuantumLesson from '../features/lessons/classical-vs-quantum/ClassicalVsQuantumLesson';

const LessonDetail = () => {
  const { lessonId } = useParams();

  if (lessonId === 'classical-vs-quantum') {
    return <ClassicalVsQuantumLesson />;
  }
  
  if (lessonId === 'what-is-a-qubit') {
    return <QubitLesson />;
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
        <span>&larr;</span> BACK TO CURRICULUM
      </Link>
      
      <div className="sci-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
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
