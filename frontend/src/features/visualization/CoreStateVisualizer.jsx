const formatNumber = (num) => {
  if (Math.abs(num) < 1e-6) return '0.0000';
  const str = num.toFixed(4);
  return num >= 0 ? ` ${str}` : str;
};

const formatPhase = (real, imag) => {
  const r2 = real * real + imag * imag;
  if (r2 < 1e-10) return '—';
  let phase = Math.atan2(imag, real);
  let degrees = phase * (180 / Math.PI);
  if (degrees < 0) degrees += 360;
  return `${degrees.toFixed(1)}°`;
};

const PhaseDial = ({ real, imag, magnitude }) => {
  const rMax = 12; // radius for magnitude = 1
  const x = real * rMax;
  const y = -imag * rMax; // SVG y is down

  return (
    <svg width="32" height="32" viewBox="-16 -16 32 32" style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
      {/* Unit circle background */}
      <circle cx="0" cy="0" r={rMax} fill="var(--bg-panel-light)" stroke="var(--border-active)" strokeWidth="1" />

      {magnitude > 1e-5 ? (
        <>
          <line x1="0" y1="0" x2={x} y2={y} stroke="var(--accent-blue)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={x} cy={y} r="2" fill="var(--accent-blue)" />
        </>
      ) : (
        <circle cx="0" cy="0" r="1.5" fill="var(--text-dim)" />
      )}
    </svg>
  );
};

const CoreStateVisualizer = ({ title, desc, basisStates, statevector }) => {
  const hasValidStatevector = statevector && Array.isArray(statevector) && statevector.length > 0;

  if (!hasValidStatevector) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-dark)',
        border: '1px solid var(--border-light)',
        position: 'relative'
      }}>
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }} />

        <div style={{ position: 'relative', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Large State Display */}
          {title && (
            <div className="text-mono" style={{ fontSize: '4rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(226, 232, 240, 0.2)' }}>
              {title}
            </div>
          )}
          {desc && (
            <div className="tech-label" style={{ marginBottom: '4rem', color: 'var(--text-secondary)' }}>
              {desc}
            </div>
          )}

          {/* Probability Bars */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', width: '100%', maxWidth: '400px' }}>
            {basisStates?.map((state, index) => {
              const colors = ['var(--accent-blue)', 'var(--accent-amber)', '#8b5cf6', '#10b981'];
              const color = colors[index % colors.length];

              return (
                <div key={state.label} style={{ flex: 1, minWidth: '100px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div className="tech-label" style={{ color }}>P({state.label.replace(/[|⟩]/g, '')})</div>
                    <div className="text-mono" style={{ color }}>{state.probability}%</div>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-light)', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, bottom: 0,
                      width: `${state.probability}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`,
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Statevector render
  const numStates = statevector.length;
  const numQubits = Math.max(1, Math.ceil(Math.log2(numStates)));

  // Calculate probabilities and normalize
  const states = statevector.map((amp, index) => {
    // Graceful handling of malformed amplitude entries
    const r = typeof amp?.real === 'number' ? amp.real : 0;
    const i = typeof amp?.imag === 'number' ? amp.imag : 0;
    const magSq = r * r + i * i;
    const mag = Math.sqrt(magSq);
    const binStr = index.toString(2).padStart(numQubits, '0');
    const textbookLabel = binStr.split('').reverse().join('');
    return {
      index,
      label: `|${textbookLabel}⟩`,
      real: r,
      imag: i,
      magSq,
      mag
    };
  });

  const totalProb = states.reduce((sum, s) => sum + s.magSq, 0);
  const normStates = states.map(s => {
    const prob = totalProb > 0 ? (s.magSq / totalProb) : 0;
    return { ...s, prob, probPercent: prob * 100 };
  });

  return (
    <div className="sci-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       <div style={{ marginBottom: '1rem' }}>
         {title && <h3 className="text-white" style={{ marginBottom: '0.5rem' }}>{title}</h3>}
         {desc && <p className="tech-label">{desc}</p>}
       </div>

       <div style={{ overflowX: 'auto' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
           <thead>
             <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-dim)' }}>
               <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Basis</th>
               <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Real</th>
               <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Imag</th>
               <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Magnitude |α|</th>
               <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Prob |α|²</th>
               <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Phase</th>
               <th style={{ padding: '0.75rem', fontWeight: 'normal', textAlign: 'center' }}>Amplitude</th>
             </tr>
           </thead>
           <tbody>
             {normStates.map((s) => {
                const isZero = s.magSq < 1e-10;
                const rowStyle = { borderBottom: '1px solid var(--border-light)', opacity: isZero ? 0.4 : 1 };

                return (
                  <tr key={s.label} style={rowStyle}>
                    <td style={{ padding: '0.75rem', color: 'var(--accent-blue)' }}>{s.label}</td>
                    <td style={{ padding: '0.75rem', whiteSpace: 'pre' }}>{formatNumber(s.real)}</td>
                    <td style={{ padding: '0.75rem', whiteSpace: 'pre' }}>{formatNumber(s.imag)}</td>
                    <td style={{ padding: '0.75rem', whiteSpace: 'pre' }}>{formatNumber(s.mag)}</td>
                    <td style={{ padding: '0.75rem', minWidth: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '50px', display: 'inline-block', textAlign: 'right' }}>
                           {s.probPercent.toFixed(1)}%
                        </span>
                        <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--bg-panel-light)', position: 'relative' }}>
                          <div style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0,
                            width: `${s.probPercent}%`,
                            backgroundColor: 'var(--accent-blue)',
                            boxShadow: isZero ? 'none' : '0 0 8px var(--accent-blue)'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{formatPhase(s.real, s.imag)}</td>
                    <td style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                      <PhaseDial real={s.real} imag={s.imag} magnitude={s.mag} />
                    </td>
                  </tr>
                );
             })}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default CoreStateVisualizer;
