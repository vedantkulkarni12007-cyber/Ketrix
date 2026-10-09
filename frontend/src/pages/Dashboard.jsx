import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { curriculumData } from '../data/curriculum';

const Dashboard = () => {
  const [completedLessons, setCompletedLessons] = useState(() => {
    return JSON.parse(localStorage.getItem('ketrix_completed_lessons') || '[]');
  });
  const [labStats, setLabStats] = useState(() => {
    return JSON.parse(localStorage.getItem('ketrix_lab_stats') || '{"executions":0}');
  });

  useEffect(() => {
    // Initialization is now handled lazily above
  }, []);

  const totalLessons = curriculumData.reduce((acc, cat) => acc + cat.lessons.length, 0);
  const masteryScore = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100);

  // Determine next action
  let nextLesson = null;
  for (const cat of curriculumData) {
    for (const lesson of cat.lessons) {
      if (!completedLessons.includes(lesson.id)) {
        nextLesson = lesson;
        break;
      }
    }
    if (nextLesson) break;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem' }}>
        <div className="tech-label text-blue" style={{ marginBottom: '1rem', letterSpacing: '0.2em' }}>LOCAL WORKSPACE</div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
      </div>

      {/* Telemetry row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="sci-panel" style={{ padding: '2rem' }}>
          <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>MODULES COMPLETED</div>
          <div className="text-mono" style={{ fontSize: '3rem', color: 'var(--accent-blue)' }}>
            {completedLessons.length.toString().padStart(2, '0')}
            <span style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>/{totalLessons.toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="sci-panel" style={{ padding: '2rem' }}>
          <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>LAB EXECUTIONS</div>
          <div className="text-mono" style={{ fontSize: '3rem', color: 'var(--accent-amber)' }}>
            {labStats.executions === 0 ? '--' : labStats.executions.toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="sci-panel" style={{ padding: '2rem' }}>
          <div className="tech-label" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>MASTERY SCORE</div>
          <div className="text-mono" style={{ fontSize: '3rem', color: masteryScore > 0 ? 'var(--accent-green)' : 'var(--text-dim)' }}>
            {masteryScore > 0 ? `${masteryScore}%` : '--'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
        
        {/* Next up */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Continue Learning</h2>
          {nextLesson ? (
            <div className="sci-panel" style={{ padding: '2rem', backgroundColor: 'var(--bg-panel-light)' }}>
              <div className="tech-label text-blue" style={{ marginBottom: '1rem' }}>EXP-{nextLesson.expId.toString().padStart(2, '0')}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{nextLesson.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>{nextLesson.description}</p>
              <Link to={`/learn/${nextLesson.id}`}>
                <button style={{ width: '100%', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>RESUME CURRICULUM</button>
              </Link>
            </div>
          ) : (
            <div className="sci-panel" style={{ padding: '2rem', borderStyle: 'dashed', borderColor: 'var(--accent-green)', textAlign: 'center' }}>
              <div className="tech-label text-green" style={{ marginBottom: '1rem' }}>SYSTEM MASTERED</div>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>You have completed all available curriculum modules.</p>
            </div>
          )}
        </div>

        {/* Shortcuts */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/lab">
              <div className="sci-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Quantum Laboratory</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Build custom circuits on the visual grid.</div>
                </div>
                <div style={{ color: 'var(--accent-blue)' }}>&rarr;</div>
              </div>
            </Link>
            
            <Link to="/simulator">
              <div className="sci-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Backend Simulator</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure and view Qiskit Aer environments.</div>
                </div>
                <div style={{ color: 'var(--accent-blue)' }}>&rarr;</div>
              </div>
            </Link>
          </div>
          
          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'var(--bg-panel)', borderLeft: '3px solid var(--accent-blue)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Note:</strong> Telemetry is stored locally on your machine. Ketrix prioritizes a private, client-side workspace environment for your experiments.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
