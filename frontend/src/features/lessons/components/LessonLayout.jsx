import { Link } from 'react-router-dom';
import { curriculumData } from '../../../data/curriculum';

const allLessons = curriculumData.flatMap(cat => cat.lessons);

const LessonLayout = ({ expId, title, children }) => {
  const currentIndex = allLessons.findIndex(l => l.expId === expId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
        <span>&larr;</span> BACK TO CURRICULUM
      </Link>
      
      <div style={{ marginBottom: '4rem' }}>
        <div className="tech-label" style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>
          {expId} // THEORETICAL FOUNDATIONS
        </div>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {children}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
        {prevLesson ? (
          <Link to={`/learn/${prevLesson.id}`} className="tech-label text-dim" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>&larr;</span> PREV: {prevLesson.title}
          </Link>
        ) : <div></div>}
        
        {nextLesson ? (
          <Link to={`/learn/${nextLesson.id}`} className="tech-label text-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            NEXT: {nextLesson.title} <span>&rarr;</span>
          </Link>
        ) : <div></div>}
      </div>
    </div>
  );
};

export default LessonLayout;
