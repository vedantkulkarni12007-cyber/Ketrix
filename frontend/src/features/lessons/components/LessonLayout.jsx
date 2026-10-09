import { Link } from 'react-router-dom';
import { curriculumData } from '../../../data/curriculum';

const allLessons = curriculumData.flatMap(cat => cat.lessons);

const LessonLayout = ({ expId, title, children }) => {
  const currentIndex = allLessons.findIndex(l => l.expId === expId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="container" style={{ maxWidth: '1000px', paddingBottom: '6rem' }}>
      <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <span>&larr;</span> BACK TO CURRICULUM
      </Link>
      
      <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
        <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem', letterSpacing: '0.2em' }}>
          {expId} // THEORETICAL FOUNDATIONS
        </div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {children}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-light)' }}>
        {prevLesson ? (
          <Link to={`/learn/${prevLesson.id}`} style={{ textDecoration: 'none' }}>
            <div className="sci-panel" style={{ padding: '1rem 1.5rem', transition: 'all 0.2s', borderColor: 'transparent', backgroundColor: 'transparent' }}
                 onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div className="tech-label text-dim" style={{ marginBottom: '0.5rem' }}>&larr; PREVIOUS MODULE</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>{prevLesson.title}</div>
            </div>
          </Link>
        ) : <div />}
        
        {nextLesson ? (
          <Link to={`/learn/${nextLesson.id}`} style={{ textDecoration: 'none', textAlign: 'right' }}>
            <div className="sci-panel" style={{ padding: '1rem 1.5rem', transition: 'all 0.2s', borderColor: 'transparent', backgroundColor: 'transparent' }}
                 onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; e.currentTarget.style.borderColor = 'var(--accent-blue)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div className="tech-label text-blue" style={{ marginBottom: '0.5rem' }}>NEXT MODULE &rarr;</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>{nextLesson.title}</div>
            </div>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default LessonLayout;
