
const LessonSection = ({ number, title, children }) => {
  return (
    <section className="sci-panel">
      <div className="tech-label" style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>
        {number} &mdash; {title.toUpperCase()}
      </div>
      <h2 style={{ marginBottom: '1.5rem' }}>{title}</h2>
      {children}
    </section>
  );
};

export default LessonSection;
